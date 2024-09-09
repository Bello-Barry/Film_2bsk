import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAWZg09J3DF8-vYjUEMOo_kDANNDwqzWGw",
    authDomain: "film2bsk.firebaseapp.com",
    projectId: "film2bsk",
    storageBucket: "film2bsk.appspot.com",
    messagingSenderId: "738505652788",
    appId: "1:738505652788:web:181e77e3ec21167274a861",
    measurementId: "G-SMW65VQX9G"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let movies = [];

async function addMovie(title, category, link, description) {
    if (!getYouTubeId(link)) {
        showMessage("Lien YouTube invalide", "error");
        return;
    }
    try {
        await db.collection("films").add({
            title,
            category,
            link,
            description
        });
        movies.push({ title, category, link, description });
        displayMovies();
        updateCategories();
        showMessage("Film ajouté avec succès!");
        navigateTo('catalogue');
    } catch (error) {
        showMessage("Une erreur s'est produite lors de l'ajout du film", "error");
        console.error("Erreur lors de l'ajout du film :", error);
    }
}

async function fetchMovies() {
    try {
        const snapshot = await db.collection("films").get();
        movies = snapshot.docs.map(doc => doc.data());
        displayMovies();
        updateCategories();
    } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
    }
}

function displayMovies(category = null) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
    movies.forEach(movie => {
        if (!category || movie.category === category) {
            const movieElement = document.createElement('div');
            movieElement.className = 'movie';
            movieElement.innerHTML = `
                <h3>${movie.title}</h3>
                <p class="category">Catégorie: ${movie.category}</p>
                <iframe sandbox="allow-scripts allow-same-origin" width="100%" height="200" src="https://www.youtube.com/embed/${getYouTubeId(movie.link)}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                <p>${movie.description}</p>
            `;
            movieList.appendChild(movieElement);
        }
    });
}

function updateCategories() {
    const categoryList = document.getElementById('category-list');
    const categories = [...new Set(movies.map(movie => movie.category))];
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category;
        button.addEventListener('click', () => {
            document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayMovies(category);
        });
        categoryList.appendChild(button);
    });
}

function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function showMessage(msg, type = "success") {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = type === "success" ? "#27ae60" : "#c0392b";
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function navigateTo(pageId) {
    window.location.href = `${pageId}.html`;
}

// Gestion du formulaire d'ajout de film
document.getElementById('add-movie-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('movie-title').value;
    const category = document.getElementById('movie-category').value;
    const link = document.getElementById('movie-link').value;
    const description = document.getElementById('movie-description').value;
    addMovie(title, category, link, description);
    this.reset();
});

// Initialisation
fetchMovies();
