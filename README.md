# 🌸 Iris Flower Classifier – Frontend

A simple **static web app** (HTML + CSS + JavaScript) hosted on **GitHub Pages** that predicts the species of an Iris flower using a **Flask backend API** deployed on Hugging Face Spaces.  

👉 **Live Demo:** [Iris Classifier Frontend](https://lovnishverma.github.io/iris-front/)  
👉 **Backend API:** [Hugging Face Space](https://huggingface.co/spaces/lovnishverma/iris-backend)  


<img width="1919" height="675" alt="image" src="https://github.com/user-attachments/assets/e2b8664d-551e-4e2f-94ee-1ab467a648cd" />


---

## 🚀 How it works

1. User enters flower measurements (sepal & petal length/width) in the form.  
2. JavaScript sends a `POST` request to the backend API.  
3. The Flask backend predicts the flower species using a Logistic Regression model.  
4. The predicted species is displayed instantly in the browser.  

---

## 🔧 Tech Stack

- **HTML5** – UI structure  
- **CSS3** – Basic styling  
- **Vanilla JavaScript** – Handles API requests  
- **GitHub Pages** – Hosting static frontend  
- **Flask + Scikit-learn (Backend)** – ML model & API  

---

## 📂 File Structure

```

├── index.html    # Main UI
├── script.js     # Handles API call
├── style.css     # Styling
└── README.md     # Project documentation

````

---

## 📡 API Integration

The frontend connects to the backend API:

```javascript
const backendUrl = "https://lovnishverma-iris-backend.hf.space/predict";
````

### Example Request Sent

```json
{
  "sepal_length": 5.1,
  "sepal_width": 3.5,
  "petal_length": 1.4,
  "petal_width": 0.2
}
```

### Example Response

```json
{
  "prediction": "setosa"
}
```

---

## 🛠️ Run Locally

You can also run the frontend locally:

```bash
git clone https://github.com/lovnishverma/iris-front.git
cd iris-front
```

Then just open `index.html` in your browser (double click or `Ctrl+O`).

Make sure to update `script.js` with the correct backend URL if running your own backend.

---

## 🌐 Related Projects

* **Backend (Flask + ML model):** [Hugging Face Space](https://huggingface.co/spaces/lovnishverma/iris-backend)
* **Frontend (this repo):** [GitHub Pages](https://lovnishverma.github.io/iris-front/)

---

## 📸 Demo Screenshot

![Demo Screenshot](https://github.com/user-attachments/assets/bf2d124e-592e-49a2-8c6f-b7adab049df6)

---

## 📜 License

MIT License – free to use and modify.

---
