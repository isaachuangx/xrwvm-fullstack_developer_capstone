import requests
import os
from dotenv import load_dotenv

load_dotenv()  # 加载环境变量

# 从环境变量中获取URL，如果环境变量未定义，则使用默认值
backend_url = os.getenv(
    'backend_url', 
    default="http://localhost:3030")

sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url', 
    default="http://localhost:5050/")

searchcars_url = os.getenv(
    'searchcars_url', 
    default="http://localhost:3050/")

# 构建请求URL的辅助函数
def build_url(base_url, endpoint, **kwargs):
    # 构建查询参数字符串，排除值为None的参数
    params = "&".join(f"{key}={value}" for key, value in kwargs.items() if value is not None)
    # 返回完整的URL
    return f"{base_url}{endpoint}?{params}"

# 通用的GET请求函数
def get_request(endpoint, **kwargs):
    # 使用build_url构建请求URL
    request_url = build_url(backend_url, endpoint, **kwargs)
    print(f"GET from {request_url}")
    try:
        # 发起GET请求
        response = requests.get(request_url)
        # 检查请求是否成功
        response.raise_for_status()
        # 返回JSON格式的响应数据
        return response.json()
    except requests.exceptions.RequestException as e:
        # 处理请求异常
        print(f"Network exception occurred: {e}")
        return None

# 分析评论情感的函数
def analyze_review_sentiments(text):
    # 构建请求URL
    request_url = f"{sentiment_analyzer_url}analyze/{text}"
    print(f"GET from {request_url}")
    try:
        # 发起GET请求
        response = requests.get(request_url)
        # 检查请求是否成功
        response.raise_for_status()
        # 返回JSON格式的响应数据
        return response.json()
    except requests.exceptions.RequestException as err:
        # 处理请求异常
        print(f"Unexpected error occurred: {err}")
        return None

# 提交评论的函数
def post_review(data_dict):
    # 构建请求URL
    request_url = f"{backend_url}/insert_review"
    print(f"POST to {request_url}")
    try:
        # 发起POST请求，传递JSON格式的数据
        response = requests.post(request_url, json=data_dict)
        # data_dict 作为载荷也就是需要推送的数据
        # 检查请求是否成功
        response.raise_for_status()
        # 返回JSON格式的响应数据
        response_data = response.json()
        print(response_data)
        return response_data
    except requests.exceptions.RequestException as e:
        # 处理请求异常
        print(f"Network exception occurred: {e}")
        return None

# 特定的searchcars请求函数
def searchcars_request(endpoint, **kwargs):
    # 使用build_url构建请求URL
    request_url = build_url(searchcars_url, endpoint, **kwargs)
    print(f"GET from {request_url}")
    try:
        # 发起GET请求
        response = requests.get(request_url)
        # 检查请求是否成功
        response.raise_for_status()
        # 返回JSON格式的响应数据
        return response.json()
    except requests.exceptions.RequestException as e:
        # 处理请求异常
        print(f"Network exception occurred: {e}")
        return None
