from flask import Flask, render_template, jsonify
import json
import os
import requests

app = Flask(__name__)


@app.route('/')  # 首頁
def home_page():
    # 獲取匯率資訊
    r = requests.get('https://tw.rter.info/capi.php')
    currency = r.json()
    AUD = currency["USDAUD"]["Exrate"]  # 澳幣
    TWD = currency["USDTWD"]["Exrate"]  # 台幣
    AUDTWD = round(
        TWD / AUD, 2)

    data = {"AUDTWD": AUDTWD}

    return render_template('index.html', active_page='home', data=data)


@app.route('/itinerary')  # 行程
def itinerary():
    return render_template('itinerary.html', active_page='itinerary')


@app.route('/expenses-content')  # 費用內容
def expense_content():
    return render_template('expenses-content.html', active_page='expenses')


# ====== API 區 ======

# 取得專案根目錄
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# JSON 路徑
JSON_PATH = os.path.join(BASE_DIR, "data", "itinerary.json")


# ====== API 區 ======

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@app.route("/api/itinerary")
def get_itinerary():
    itinerary_json_path = os.path.join(BASE_DIR, "data", "itinerary.json")
    imagemap_json_path = os.path.join(BASE_DIR, "data", "imagemap.json")
    # 加入錯誤處理，如果檔案不存在，回傳空陣列或假資料
    if not os.path.exists(itinerary_json_path):
        # 這裡回傳一個範例，避免前端壞掉
        return jsonify([
            {"id": 1, "day": 1, "location": "範例資料",
                "activity": "請建立 data/itinerary.json", "notes": "檔案未找到"}
        ])

    try:
        with open(itinerary_json_path, "r", encoding="utf-8") as f:
            itinerary_data = json.load(f)

        with open(imagemap_json_path, "r", encoding="utf-8") as f:
            imagemap_data = json.load(f)

        data = {"itinerary_data": itinerary_data,
                "imagemap_data": imagemap_data}
        return jsonify(data)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return jsonify([])


@app.route("/api/expenses")
def get_expense():
    expenses_json_path = os.path.join(BASE_DIR, "data", "expenses.json")
    # 加入錯誤處理，如果檔案不存在，回傳空陣列或假資料
    if not os.path.exists(expenses_json_path):
        # 這裡回傳一個範例，避免前端壞掉
        return jsonify([
            {"id": 1, "day": 1, "location": "範例資料",
                "activity": "請建立 data/expenses.json", "notes": "檔案未找到"}
        ])

    try:
        with open(expenses_json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        return jsonify(data)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return jsonify([])


if __name__ == '__main__':
    app.run(debug=True)
