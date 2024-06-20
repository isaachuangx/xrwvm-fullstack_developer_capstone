# Uncomment the required imports before adding the code

from django.http import JsonResponse  # 修改导入
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate
from .models import CarMake, CarModel
from .restapis import get_request, analyze_review_sentiments, post_review, searchcars_request

# Get an instance of a logger
logger = logging.getLogger(__name__)


def get_cars(request):
    try:
        count = CarMake.objects.filter().count()
        print(count)
        if count == 0:
            logger.info("No CarMake records found, initiating data.")
            initiate()

        car_models = CarModel.objects.select_related('car_make')
        cars = [
            {"CarModel": car_model.name, "CarMake": car_model.car_make.name}
            for car_model in car_models
        ]
        logger.debug(f"Car models fetched: {cars}")
        return JsonResponse({"CarModels": cars})
    except Exception as e:
        logger.error(f"Error fetching car models: {e}", exc_info=True)
        return JsonResponse(
            {"CarModels": [], "error": "Failed to fetch car models"},
            status=500
        )

def get_inventory(request):
    # 从请求参数中获取'dealer_id'
    dealer_id = request.GET.get('dealer_id', None)
    
    # 检查'dealer_id'是否存在，如果不存在则返回400错误
    if not dealer_id:
        return JsonResponse({"status": 400, "message": "Bad request. 'dealer_id' parameter is required."})
    
    # 获取其他可能的参数
    make = request.GET.get('make', None)
    model = request.GET.get('model', None)
    max_mileage = request.GET.get('max_mileage', None)
    price = request.GET.get('price', None)
    year = request.GET.get('year', None)

    try:
        # 构建不同的endpoint和参数
        if make:
            endpoint = f"/carsbymake/{dealer_id}/{make}"
        elif model:
            endpoint = f"/carsbymodel/{dealer_id}/{model}"
        elif max_mileage:
            endpoint = f"/carsbymaxmileage/{dealer_id}/{max_mileage}"
        elif price:
            endpoint = f"/carsbyprice/{dealer_id}/{price}"
        elif year:
            endpoint = f"/carsbyyear/{dealer_id}/{year}"
        else:
            endpoint = f"/cars/{dealer_id}"

        # 调用 searchcars_request 函数从 API 获取库存数据
        cars_inventory = searchcars_request(endpoint)
        
        # 检查是否获取到库存数据
        if cars_inventory:
            return JsonResponse({"status": 200, "inventory": cars_inventory})
        else:
            return JsonResponse({"status": 404, "message": "No inventory found for the given dealer_id."})
    except Exception as e:
        # 处理异常，记录错误日志并返回500状态
        logger.error(f"Error fetching inventory: {e}", exc_info=True)
        return JsonResponse({"status": 500, "message": "Internal server error"})


@csrf_exempt
def login_user(request):
    logger.info("Handling user login.")
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    user = authenticate(username=username, password=password)
    response_data = {"userName": username}
    if user is not None:
        login(request, user)
        response_data['status'] = "Authenticated"
        response_data['message'] = "Login successful."
        logger.info(f"User {username} logged in successfully.")
    else:
        response_data['status'] = "Failed"
        response_data['message'] = "Login failed. Check username and password."
        logger.warning(f"Failed login attempt for {username}.")
    return JsonResponse(response_data)


def logout_request(request):
    username = request.user.username
    logout(request)
    logger.info(f"User {username} logged out.")
    return JsonResponse({"userName": ""})


@csrf_exempt
def registration(request):
    logger.info("Handling new user registration.")
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']

    if User.objects.filter(username=username).exists():
        logger.warning(f"Attempt to re-register existing username: {username}")
        return JsonResponse(
            {"userName": username, "error": "Username already registered"},
            status=409
        )
    if User.objects.filter(email=email).exists():
        logger.warning(f"Attempt to register with existing email: {email}")
        return JsonResponse(
            {"email": email, "error": "Email already registered"},
            status=409
        )

    user = User.objects.create_user(
        username=username, email=email, password=password,
        first_name=first_name, last_name=last_name
    )
    login(request, user)
    logger.info(f"User {username} registered and logged in.")
    return JsonResponse(
        {"userName": username, "status": "Authenticated"},
        status=201
    )


def get_dealerships(request, state="All"):
    logger.info(f"Fetching dealership data for state: {state}")
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_reviews(request, dealer_id):
    logger.info(f"Fetching reviews for dealer ID: {dealer_id}")
    if dealer_id:
        endpoint = "/fetchReviews/dealer/" + str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            review_detail['sentiment'] = response['sentiment']
        return JsonResponse({"status": 200, "reviews": reviews})
    else:
        logger.error("Invalid dealer ID provided for fetching reviews.")
        return JsonResponse({"status": 400, "message": "Enter a valid ID"})


def get_dealer_details(request, dealer_id):
    logger.info(f"Fetching details for dealer ID: {dealer_id}")
    if dealer_id:
        endpoint = "/fetchDealer/" + str(dealer_id)
        logger.info(f"Requesting endpoint: {endpoint}")
        dealership = get_request(endpoint)
        logger.info(f"Received dealership data: {dealership}")
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        logger.error("Invalid dealer ID provided for fetching details.")
        return JsonResponse({"status": 400, "message": "Enter a valid ID"})


def add_review(request):
    if not request.user.is_anonymous:
        data = json.loads(request.body)
        logger.info(f"Adding review by user: {request.user.username}")
        try:
            post_review(data)
            return JsonResponse({"status": 200})
        except Exception as e:
            logger.error(f"Error posting review: {e}")
            return JsonResponse(
                {"status": 401, "message": "Error in posting review"}
            )
    else:
        logger.warning("Unauthorized attempt to post review.")
        return JsonResponse({"status": 403, "message": "Unauthorized"})
