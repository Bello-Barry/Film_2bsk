// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWZg09J3DF8-vYjUEMOo_kDANNDwqzWGw",
    authDomain: "film2bsk.firebaseapp.com",
    projectId: "film2bsk",
    storageBucket: "film2bsk.appspot.com",
    messagingSenderId: "738505652788",
    appId: "1:738505652788:web:181e77e3ec21167274a861",
    measurementId: "G-SMW65VQX9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let movies = [];

// Fonction pour ajouter un film
async function addMovie(title, category, link, description) {
    if (!getYouTubeId(link)) {
        showMessage("Lien YouTube invalide", "error");
        return;
    }

    try {
        await addDoc(collection(db, "films"), {
            title,
            category,
            link,
            description
        });
        movies.push({ title, category, link, description });
        displayMovies();
        updateCategories();
        showMessage("Film ajouté avec succès!");
        navigateTo('home');
    } catch (error) {
        showMessage("Une erreur s'est produite lors de l'ajout du film", "error");
        console.error("Erreur lors de l'ajout du film :", error);
    }
}

// Fonction pour récupérer les films depuis Firestore
async function fetchMovies() {
    try {
        const snapshot = await getDocs(collection(db, "films"));
        movies = snapshot.docs.map(doc => doc.data());
        displayMovies();
        updateCategories();
    } catch (error) {
        console.error("Erreur lors de la récupération des films :", error);
    }
}

// Fonction pour afficher les films
function displayMovies(category = null) {
    const movieList = document.getElementById(category ? 'category-movies' : 'movie-list');
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

// Fonction pour mettre à jour les catégories
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

// Fonction pour extraire l'ID YouTube d'un lien
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Fonction pour afficher un message
function showMessage(msg, type = "success") {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = type === "success" ? "#27ae60" : "#c0392b";
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Fonction pour naviguer entre les pages
function navigateTo(pageId) {
    document.querySelectorAll('.container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
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

// Navigation
document.querySelectorAll('header a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo(this.getAttribute('href').substr(1));
    });
});

// Initialisation
fetchMovies();
