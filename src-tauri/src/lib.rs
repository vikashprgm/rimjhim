use std::{sync::{Arc}, vec};

use lancedb::{Connection, query::{ExecutableQuery, QueryBase}};
use ollama_rs::{
    Ollama, 
    generation::{
        embeddings::request::GenerateEmbeddingsRequest,
        embeddings::request::EmbeddingsInput,
    }
};
use arrow_array::{Array, FixedSizeListArray, Float32Array, Int32Array, RecordBatch, StringArray};
use arrow_schema::{DataType, Field};
use futures::{TryStreamExt, stream::StreamExt};
use arrow_array::cast::AsArray;

struct DbState{
    conn: Connection,
}

// Add functionality to detect if table exists
pub async fn is_table() -> bool {
    todo!()
}

// Add functionality to check model availibility
pub async fn is_model(model : String) -> bool {
    let ollama = Ollama::default();
    let avail_mods = ollama.list_local_models().await.unwrap();
    
    for i in 0..avail_mods.len(){
        if avail_mods[i].name == model {
            return true;
        }
    }
    return false;
}   

pub async fn str_to_embd (input : String, model: String) -> Result<Vec<f32>,String> {
    let ollama = Ollama::default();
    
    let exists = is_model(model.clone()).await;
    if !exists {
        //download model code
    };

    let embedding_res = ollama.generate_embeddings(
        GenerateEmbeddingsRequest::new(
            model, 
            EmbeddingsInput::Single(input.clone())
        )
    ).await.unwrap();
    
    let embedding_vector = embedding_res.embeddings.get(0).unwrap();
    Ok(embedding_vector.clone())
}

#[tauri::command]
async fn store_embd(input : String, model: String , state : tauri::State<'_, DbState>)-> Result<String,String>{
    let table = state.conn.open_table("notes_table").execute().await.map_err(|e| e.to_string())?;
    let schema  = table.schema().await.map_err(|e| e.to_string())?;
    
    let embedding_vector = str_to_embd(input.clone(), model.clone()).await.map_err(|e|e.to_string())?;
    let emb_size = embedding_vector.len() as i32;
    let vector_value = Float32Array::from(embedding_vector);
    
    table.add(RecordBatch::try_new(schema.clone(),vec![
        Arc::new(Int32Array::from(vec![1])),
        Arc::new(StringArray::from(vec![input.clone()])),
        Arc::new(
            FixedSizeListArray::new(
                Arc::new(Field::new("item", DataType::Float32, true)),
                emb_size,
                Arc::new(vector_value.clone()),
                None
            )
        ),
        ])
        .map_err(|e| e.to_string())?)
        .execute()
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(String::from("Done"))
}

//convert user query -> vector , search vector in db, get top 5 results;
#[tauri::command]
async fn search_embd (slice : String, model : String, state : tauri::State<'_, DbState> ) -> Result<Vec<String>,String> {
    let table = state.conn.open_table("notes_table").execute().await.unwrap();
    let embd_vect = str_to_embd(slice, model).await.map_err(|e|e.to_string())?;
    let mut search_res = table
        .query()
        .nearest_to(embd_vect)
        .map_err(|e | e.to_string())?
        .limit(5)
        .execute()
        .await
        .map_err(|e | e.to_string())?;
    
    let mut ans: Vec<String> = Vec::new();
    ans.reserve(5);
    
    // iterate on vector stream now
    while let Some(batch) = search_res.next().await {
        ans.extend( batch
            .unwrap()
            .column_by_name("original")
            .unwrap()
            .as_string::<i32>()
            .iter()
            .flatten()
            .map(|s| s.to_string())
        )
    }
    Ok(ans)
}

#[tauri::command]
async fn list_notes (state : tauri::State<'_, DbState>) -> Result<Vec<String>, String> {
    let table = state.conn.open_table("original").execute().await.map_err(|e| e.to_string())?;
    let stream = table.query().execute().await.map_err(|e| e.to_string())?;
    let ref_stream: Vec<RecordBatch> = stream.try_collect().await.map_err(|e| e.to_string())?;
    
    let mut ans: Vec<String> = Vec::new();

    while let Some(batch) = ref_stream.iter().next() {
        let curr = batch
            .column_by_name("original")
            .unwrap().as_string::<i32>();
                
        for i in 0..curr.len() {
            ans.push(curr.value(i).to_string());
        }
    
    }
    Ok(ans)
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db = tauri::async_runtime::block_on(lancedb::connect("local_lancedb")
        .execute())
        .expect("failed to connect to db");
    
    tauri::Builder::default()
        .manage(DbState { conn : db})
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![store_embd,search_embd,list_notes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


