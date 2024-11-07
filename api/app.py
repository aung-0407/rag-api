import logging
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import AzureOpenAIEmbeddings, AzureChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.schema import HumanMessage
import glob



load_dotenv()

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app) 

API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
END_POINT = os.getenv("END_POINT")
MODEL = os.getenv("MODEL")
API_VERSION = os.getenv("API_VERSION")

TEXT_API_KEY = os.getenv("TEXT_OPENAI_API_KEY")
TEXT_END_POINT = os.getenv("TEXT_END_POINT")
TEXT_MODEL = os.getenv("TEXT_MODEL")

UPLOAD_FOLDER = 'upload'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


embeddings = AzureOpenAIEmbeddings(
    openai_api_key=TEXT_API_KEY,
    azure_endpoint=f"https://{TEXT_END_POINT}",
    azure_deployment=TEXT_MODEL
)


def get_recently_uploaded_file_path(upload_directory):
    list_of_files = glob.glob(os.path.join(upload_directory, '*.pdf'))
    if not list_of_files:
        logging.warning("No PDF files found in the upload directory.")
        return None
    
    latest_file = max(list_of_files, key=os.path.getmtime)
    logging.debug(f"$$$$$$$$$$$$$$$$$$$$$$$$$$$%%%%%%%%%%%%%%%%%%%%Lastest file @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@{latest_file}")
    return latest_file



upload_directory = "C:/Users/AungAungHtet/Desktop/wk/react-project/rag-api/upload/"
uploaded_file_path = get_recently_uploaded_file_path(upload_directory)

if uploaded_file_path:
    logging.debug(f"Latest uploaded file: {uploaded_file_path}")
else:
    logging.debug("No PDF files found.")

if uploaded_file_path is not None:
    try:
        pdf_loader = PyPDFLoader(uploaded_file_path)

        pages = pdf_loader.load_and_split()
        if not pages:
            logging.error("No pages found in the uploaded PDF.")
        else:
            chroma_index = Chroma.from_documents(pages, embeddings)
    except Exception as e:
        logging.error(f"Failed to load PDF: {str(e)}")
else:
    logging.error("Cannot load PDF because no file was found.")

    
# pdf_loader = PyPDFLoader(uploaded_file_path)
# pages = pdf_loader.load_and_split()
# chroma_index = Chroma.from_documents(pages, embeddings)




def generate_number():
    num = 100000
    while num >= -1:
        yield num
        num -= 1

number_generator = generate_number()

@app.route('/' , methods=['GET'])
def home():
    return "Running backend !!!"

@app.route('/api/chat' , methods=['POST'])
def chat():

    data = request.json
    user_input = data.get('message')

    logging.debug(f"Incoming data: {data}")
    logging.debug(f"Chroma Index: {chroma_index}")

    if not user_input:
        return jsonify({'error' : 'No Message'}) , 400
 
    if chroma_index is None:
        return jsonify({'error': 'No PDF has been uploaded yet. Please upload a PDF first.'}), 400

    try:
        docs = chroma_index.similarity_search(user_input , k=1)

        text_to_summarize = " ".join(doc.page_content for doc in docs)

        llm = AzureChatOpenAI(
            openai_api_key=API_KEY,
            azure_endpoint=f"https://{END_POINT}",
            deployment_name=MODEL, 
            temperature=0.7,
            api_version=API_VERSION,
        )    

        messages = [HumanMessage(content=f"Based on the PDF data, please tell me the {user_input}:\n\n{text_to_summarize}")]
        response = llm.invoke(messages)

        return jsonify({'response': response.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/upload-file' , methods=['POST'])
def upload_file():


    if 'file' not in request.files:
        return 'No File !!!', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
        
    file_number = next(number_generator)
    new_file_name = f"{file_number}_{file.filename}"
    logging.debug(f"********************{new_file_name}")
    file_path = os.path.join(UPLOAD_FOLDER, new_file_name)
    

    try:
        file.save(file_path)
        print(f"File saved to {file_path}")

        return jsonify({"message": "File uploaded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500        
    

if __name__ == '__main__':
    app.run(debug=True , port=5000)