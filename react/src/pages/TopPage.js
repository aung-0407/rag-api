function TopPage(){
    return(
    <div className="top-page">
      <h1 className="title">Welcome to the RAG Application <i class="fa fa-terminal" aria-hidden="true"></i></h1>
      <p className="description">
        This application allows you to interact with PDF documents <i class="fa fa-file-pdf-o" aria-hidden="true"></i> and obtain information from <i class="fa fa-wikipedia-w" aria-hidden="true"></i>ikipedia.
        
      </p>
      <a href="/rag-chat" className="button">Go to RAG Page <i class="fa fa-terminal" aria-hidden="true"></i></a>
    </div>
    );
}

export default TopPage