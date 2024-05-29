# Uncomment the imports below before you add the function code
import requests
import os
from dotenv import load_dotenv


load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030"
)
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/"
)


def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + value + "&"

    request_url = backend_url + endpoint + "?" + params

    print("GET from {} ".format(request_url))
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        response.raise_for_status()  # 检查请求是否成功
        return response.json()
    except requests.exceptions.RequestException as e:
        # If any error occurs
        print(f"Network exception occurred: {e}")
        return None


# Add code for get requests to back end

def analyze_review_sentiments(text):

    request_url = sentiment_analyzer_url + "analyze/" + text
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        response.raise_for_status()  # 检查请求是否成功
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")


# Add code for retrieving sentiments

def post_review(data_dict):

    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(
            request_url, json=data_dict
        )  # data_dict 作为载荷也就是需要推送的数据
        response.raise_for_status()  # 检查请求是否成功
        response_data = response.json()
        print(response_data)
        return response_data
    except requests.exceptions.RequestException as e:
        print(f"Network exception occurred: {e}")
