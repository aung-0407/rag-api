import { BrowserRouter as Router , Route , Routes } from 'react-router-dom';
import TopPage from '../pages/TopPage';
import RAGChat from '../pages/RAGChat';
import Upload from '../pages/Upload';

function Navbar(){
    return(
        <Router>
            <Routes>
                <Route path='/' Component={TopPage}/>
                <Route path='/rag-chat' Component={RAGChat}/>
                <Route path='/upload-file' Component={Upload}/>
            </Routes>
        </Router>
    );
}

export default Navbar
