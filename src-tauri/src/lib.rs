use std::{sync::{Arc, Mutex}, vec};

use lancedb::{Connection, Error, connection::ConnectBuilder};
use ollama_rs::{
    Ollama, 
    generation::{
        completion::request::GenerationRequest,
        embeddings::request::GenerateEmbeddingsRequest,
        embeddings::request::EmbeddingsInput,
    }
};
use arrow_array::{FixedSizeListArray, Float32Array, Int32Array, RecordBatch,  StringArray};
use arrow_schema::{DataType, Field};

struct DbState{
    conn: Connection,
}
#[tauri::command]

// Add functionality to detect if table exists
// Add functionality to check model availibility
async fn store_embeddings(input : String, model: String , state : tauri::State<'_, DbState>)-> Result<String,String>{
    let ollama = Ollama::default();
    let table = state.conn.open_table("notes_table").execute().await.map_err(|e| e.to_string())?;
    let schema  = table.schema().await.map_err(|e| e.to_string())?;
    
    let embedding_res = ollama.generate_embeddings(
        GenerateEmbeddingsRequest::new(
            model, 
            EmbeddingsInput::Single(input.clone())
        )
    ).await.unwrap();
    let embedding_vector = embedding_res.embeddings.get(0).unwrap();
    let vector_value = Float32Array::from(embedding_vector.clone());
    
    table.add(RecordBatch::try_new(schema.clone(),vec![
        Arc::new(Int32Array::from(vec![1])),
        Arc::new(StringArray::from(vec![input.clone()])),
        Arc::new(
            FixedSizeListArray::new(
                Arc::new(Field::new("item", DataType::Float32, true)),
                embedding_vector.len() as i32, 
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db = tauri::async_runtime::block_on(lancedb::connect("local_lancedb")
        .execute())
        .expect("failed to connect to db");
    
    tauri::Builder::default()
        .manage(DbState { conn : db})
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![store_embeddings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


