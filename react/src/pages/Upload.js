import '../css/RAGChat.css'; 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


const api = process.env.REACT_APP_API_UPLOAD;
function Upload(){
    const navigate = useNavigate(); 
    const [file,setFile] = useState(null);
    const [lastUploaded , setLastUploaded] = useState({name : '' , time : ''});

    const handleFileChange = (e)=>{
        setFile(e.target.files[0]);
    }

    const handleFileUpload = async () => {
        if(!file){
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('file' , file);

        try{
            let data = await axios.post(api, formData);
            if(data){
                alert("File uploaded successfully!");
                const currentTime = new Date().toLocaleString();
                const uploadedFileDetails = {name : file.name, time : currentTime}
                setLastUploaded(uploadedFileDetails);
                localStorage.setItem('lastUploadedFile', JSON.stringify(uploadedFileDetails));

            }


        }catch(err){
            console.log("Error Upload File : ", err);
            alert("Error uploading file. Please try again.");
        }
    }

    useEffect(() => {
        const storedFileDetails = localStorage.getItem('lastUploadedFile');
        if (storedFileDetails) {
            setLastUploaded(JSON.parse(storedFileDetails));
        }
    }, []);


    return(
        <div className="rag-chat">
            <div className="d-flex align-items-center mb-3">
                <button 
                    className='btn btn-sm btn-dark' style={{marginRight:"34rem"}} 
                    onClick={() => navigate('/rag-chat')}
                >
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;&nbsp;Back
                </button>
            </div>
            <h3 className="">Upload <i class="fa fa-file-pdf-o" aria-hidden="true" style={{fontSize:"25px"}}></i></h3>

            <div className='container p-3'>
                <div className='row'>
                    <div className='col-3'>

                    </div>
                    <div className='col-6'> 
                        <input type='file' className='form-control'  onChange={handleFileChange}/>
                        <button className='btn btn-sm btn-dark' onClick={handleFileUpload}>Upload</button>
                    </div>
                    <div className='col-3'>

                    </div>
                </div>

                {
                    lastUploaded.name && (
                        <div className='container mt-5 p-5'>
                            <div className='row'>
                                <div className='col-3'></div>
                                <div className='col-6'>
                                    <div className='card p-3' style={{boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;"}}>
                                        <h5 className="card-title">Last Uploaded File</h5>
                                        <hr></hr>
                                    <div className="card-body">
                                        <p className="card-text"><strong>File Name : </strong>{lastUploaded.name}</p>
                                        <p className="card-text"><strong>Uploaded Time :</strong> {lastUploaded.time}</p>
                                    </div>                          
                                </div>
                                </div>
                                <div className='col-3'></div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}


export default Upload