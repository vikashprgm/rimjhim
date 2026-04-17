async fn ask (prompt : String , model : String ) -> Result<String, String> {
    let ollama = Ollama::default();
    let request = GenerationRequest::new(model, prompt);
    match ollama.generate(request).await {
        Ok(response) => Ok(response.response),
        Err(e) => Err(format!("Ollama Error : {}" , e)),
    }
}


// function to connect db
// async fn connect_db()->Connection {
//     lancedb::connect("local_lancedb").execute().await.unwrap()
// }

//function to store embeddings 
// async  fn store_embeddings(){
//     todo!()
// }

//function to do RAG
// async fn search() -> Vec<Vec<string>> {
//     todo!()
// }

//function to list all notes
async fn map_notes(){
    todo!()
}

// const Schema: Arc<Schema> = Arc::new(Schema::new(vec![
//         Field::new("id", DataType::Int32, false),
//         Field::new("original", DataType::Utf8,false),
//         Field::new(
//             "vector",
//             DataType::FixedSizeList(Arc::new(Field::new("item", DataType::Float32, true)), ndims),
//             true,
//         ),
//     ]));


// async fn generate_embedding( input : String, model :String) -> Result<String,String> {
//     let db = lancedb::connect("local_lancedb").execute().await.unwrap();
//     let ollama = Ollama::default();
    
//     let formatted_input = EmbeddingsInput::Single(input.clone());
//     let embedding_request = GenerateEmbeddingsRequest::new(model, formatted_input);
//     let embedding_response = ollama.generate_embeddings(embedding_request).await.unwrap();
//     let embedding = embedding_response.embeddings.get(0).ok_or("error getting embedding").unwrap();

//     let ndims = embedding.len() as i32;
//     let table_schema: Arc<Schema> = Arc::new(Schema::new(vec![
//         Field::new("id", DataType::Int32, false),
//         Field::new("original", DataType::Utf8,false),
//         Field::new(
//             "vector",
//             DataType::FixedSizeList(Arc::new(Field::new("item", DataType::Float32, true)), ndims),
//             true,
//         ),
//     ]));
//     let vector_values = Float32Array::from(embedding.clone());
//     let item_field = Arc::new(Field::new("item", DataType::Float32, true));
//     let vector_array = FixedSizeListArray::try_new(
//         item_field, 
//         ndims,                
//         Arc::new(vector_values), 
//         None                   
//     ).unwrap();
    
//     let batch = RecordBatch::try_new(
//         table_schema.clone(),
//         vec![
//             Arc::new(Int32Array::from(vec![1])),
//             Arc::new(StringArray::from(vec![input])),
//             Arc::new(vector_array),
//         ],
//     ).map_err(|e| e.to_string())?;

//     db.create_table("notes_table", batch)
//         .execute()
//         .await
//         .map_err(|e| e.to_string())?;
//     Ok("Data successfully embedded and stored!".to_string())

// }
