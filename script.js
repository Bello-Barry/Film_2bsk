// Import the functions you need from the SDKs you need
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

console.log("Firebase initialized"); // Débogage

let movies = [];

// Fonction pour ajouter un film
async function addMovie(title, category, link, description) {
  console.log("Ajout de film - Données:", {
    title, category, link, description
  }); // Débogage
  if (!getYouTubeId(link)) {
    showMessage("Lien YouTube invalide", "error");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "films"), {
      title,
      category,
      link,
      description
    });
    console.log("Film ajouté avec l'ID:", docRef.id); // Débogage
    movies.push({
      title, category, link, description
    });
    displayMovies();
    updateCategories();
    showMessage("Film ajouté avec succès!");
    navigateTo('home');
  } catch (error) {
    console.error("Erreur lors de l'ajout du film :", error);
    showMessage("Une erreur s'est produite lors de l'ajout du film", "error");
  }
}

// Fonction pour récupérer les films depuis Firestore
async function fetchMovies() {
  try {
    console.log("Récupération des films..."); // Débogage
    const snapshot = await getDocs(collection(db, "films"));
    movies = snapshot.docs.map(doc => doc.data());
    console.log("Films récupérés:", movies); // Débogage
    displayMovies();
    updateCategories();
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
  }
}

// Fonction pour afficher les films
function displayMovies(category = null) {
  console.log("Affichage des films, catégorie:", category); // Débogage
  const movieList = document.getElementById(category ? 'category-movies': 'movie-list');
  if (!movieList) {
    console.error("Élément movie-list non trouvé"); // Débogage
    return;
  }
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

// Autres fonctions restent inchangées...

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM chargé, initialisation..."); // Débogage
  fetchMovies();

  // Gestion du formulaire d'ajout de film
  const form = document.getElementById('add-movie-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('movie-title').value;
      const category = document.getElementById('movie-category').value;
      const link = document.getElementById('movie-link').value;
      const description = document.getElementById('movie-description').value;
      addMovie(title, category, link, description);
      this.reset();
    });
  } else {
    console.error("Formulaire d'ajout de film non trouvé"); // Débogage
  }

  // Navigation
  document.querySelectorAll('header a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo(this.getAttribute('href').substr(1));
    });
  });
});

// Assurez-vous que cette ligne est à la fin du fichier
console.log("Script chargé"); // Débogage 
