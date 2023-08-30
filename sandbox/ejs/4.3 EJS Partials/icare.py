import pytesseract
from PIL import Image
import google.generativeai as palm
import os
import sys

def prompt_me(msg, text):
    # print("#######################################################")
    print()
    # print(msg)
    # print("\nresponding...\n")
    # msg += text
    msg = text
    response = palm.chat(messages=msg)
    print(response.last)

if len(sys.argv) != 2:
    print("Usage: python script.py <image_filename>")
    sys.exit(1)

image_path = sys.argv[1]
if not os.path.exists(image_path):
    print(f"File '{image_path}' does not exist.")
    sys.exit(1)

palm.configure(api_key=os.environ.get('PALM'))
# image_path = '/Users/ahsalem/projects/cursus/transcendence/sandbox/ejs/4.3 EJS Partials/uploads/Laboratory-test-results.png'
image_path = sys.argv[1]
image = Image.open(image_path)
text = pytesseract.image_to_string(image)
# print(text)

# Create a new conversation
# print("\n------------------------------\n---------------------------------\n")
prompt_me("explain me the my  results in simple terms):\n", text)
# prompt_me("explain me the my  results in as if I am 5 years old, I know you don't give medical advice but just need high level understanding:\n", text)
# prompt_me("here me the my  results tell me what should I do to make me healthier\n", text)
# prompt_me("here me the my  results tell me what should I do to make me healthier\n", text)
# prompt_me("here me the my  results, please explin in to me as I do have an appointment with my doctor and I need to have quality discussion with him, \n", text)
# prompt_me("here me the my  results, please explin in to me as I do have an appointment with my doctor, tell me what kind of question should I ask my dr, \n", text)
# prompt_me("here me the my  results, please explin in to me as I do have an appointment with my doctor, tell me what kind of question should I ask my dr, aslo is there any indicator for disease or rare disease \n", text)


# Last contains the model's response:



    
#python3 -m venv venv
# #source venv/bin/activate
#pip install -U google-generativeaipip install -U google-generativeai