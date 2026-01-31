const URL = "https://teachablemachine.withgoogle.com/models/DMdA8xgkn/";
let model;

// Tab menu
document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", () => {
        const tabId = button.dataset.tab;

        document.querySelectorAll(".content").forEach(c =>
            c.classList.remove("active")
        );
        document.querySelectorAll(".tab-btn").forEach(b =>
            b.classList.remove("active")
        );

        document.getElementById(tabId).classList.add("active");
        button.classList.add("active");
    });
});

// Load model
window.addEventListener("load", async () => {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
});

// Image upload
document.getElementById("image-upload").addEventListener("change", handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        const img = document.getElementById("hidden-image");
        img.src = e.target.result;
        img.onload = () => predict(img);
    };
    reader.readAsDataURL(file);
}

async function predict(imageElement) {
    const prediction = await model.predict(imageElement);

    let best = prediction.reduce((a, b) =>
        a.probability > b.probability ? a : b
    );

    document.getElementById("label-container").innerText =
        `${best.className} : ${best.probability.toFixed(2)}`;
}
