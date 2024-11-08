const MOVIE_CONTAINER = document.querySelector(".movie-container")
const ERROR_CONTAINER = document.querySelector(".error-container")
const LOGO = document.querySelector(".header-mid>figure>img")
const MODAL = document.querySelector(".modal")
const NAV_UL = document.querySelector(".header-mid>nav>ul")
const SEARCH_FORM = document.querySelector("#search-form")
const SEARCH_INPUT = document.querySelector("#search-form").children[1]
const SEARCH_BUTTON = document.querySelector("#search-button")
const HAMBURGER_BUTTON = document.querySelector("#hamburger-button")
const OVERLAY = document.querySelector(".overlay")
const BACK_TO_TOP = document.querySelector(".back-to-top")
const BODY = document.body


// genres id as per movie api
const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};



// let apiUrl = "null"
const API_URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1"
const SEARCH_API_URL = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query="
const GENRE_API_URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1&with_genres="
const POSTER_URL = "https://image.tmdb.org/t/p/w1280"
const POSTER_COMMING_SOON_URL = "images/movie-poster-coming-soon-2.png"


let movieResultsArray = []

let showMovie = (url) => {
    fetch(url)
        .then(response => response.json())
        .then((finalResopnse) => {
            let { results } = finalResopnse

            movieResultsArray = results

            if(movieResultsArray.length === 0) {
                ERROR_CONTAINER.classList.add("active")
                ERROR_CONTAINER.innerHTML = `<h2 class="error-data-load">No Search Result Found</h2>` 
                MOVIE_CONTAINER.innerHTML = ""
                
            } else {
                createMovieCards(results)
                ERROR_CONTAINER.innerHTML = ""
                ERROR_CONTAINER.classList.remove("active")
            }  
        })
        .catch((error) => {
            console.log("Something went wrong", error)
            ERROR_CONTAINER.classList.add("active")
            ERROR_CONTAINER.innerHTML = `<h2 class="error-data-load">Failed To Load Movie Data </h2>`
        })
}

showMovie(API_URL) //initial call to show movie


// creating movie card using function
let createMovieCards = (movieResults) => {
    let movieCard = ""

    movieResults.forEach((movie, index) => {
        let { title, overview, poster_path, vote_average, release_date } = movie
        
        movieCard += `<div class="movie-card">
            <figure class="movie-poster">
                <img src="${poster_path ? POSTER_URL + poster_path : POSTER_COMMING_SOON_URL}" />
                <div class="movie-rating ${RATING_COLOR_CLASS(vote_average)}">${vote_average.toFixed(1)}</div>
                <div class="poster-overlay"></div>
                <div class="description-container">
                    <div class="read-more">
                        <p>${overview}</p>
                        <a onclick="modalData(${index})">Read More</a>
                    </div>
                </div>
            </figure>
            <div class="movie-content">
                <h3 class="movie-title">${title}</h3>
                <p class="movie-genre">${release_date}</p>
            </div>
        </div>`
    })

    MOVIE_CONTAINER.innerHTML = movieCard
}


// Rating class adder according to vote average
const RATING_COLOR_CLASS = (rating) => {
    if(rating >= 8) {
        return "hit"
    } else if (rating >= 6) {
        return "average"
    } else {
        return "flop"
    }
}


// function to add data in modal popup
function modalData(movieIndex) {
    let {original_language, original_title, overview, popularity, poster_path, release_date, title, vote_average, vote_count, genre_ids} = movieResultsArray[movieIndex]

    MODAL.firstElementChild.innerHTML = `
        <div class="modal-movie-title">
    <h3>${title}</h3>
</div>
<div class="movie-data-container">
    <figure>
        <img src="${poster_path ? POSTER_URL + poster_path : POSTER_COMMING_SOON_URL}"/>
        <div class="movie-rating ${RATING_COLOR_CLASS(vote_average)}">${vote_average.toFixed(1)}</div>
    </figure>
    <div class="movie-data">
        <div class="modal-movie-title mobile">
            <h3>${title}</h3>
        </div>
        <h4>Original Title: <span>${original_title}</span></h4>
        <h4>Genre: <span>${genre_ids.map((id) => genres[id]).join(", ")}</span></h4>
        <h4>Release Date: <span>${release_date}</span></h4>
        <h4>Original Language: <span>${original_language}</span></h4>
        <h4>Popularity: <span>${popularity}</span></h4>
        <h4>Vote Average: <span>${vote_average}</span></h4>
        <h4>Vote Count: <span>${vote_count}</span></h4>
        <div class="movie-overview">
            <p>${overview}</p>
        </div>
    </div>
</div>`

    MODAL.classList.add("active")
    OVERLAY.classList.add("active")
    OVERLAY.style.zIndex = 6;
    BODY.classList.add("active")

}


// event listener to show movies when searched
SEARCH_INPUT.addEventListener("keyup", (e) => {
    if(SEARCH_INPUT.value === "") {
        showMovie(API_URL)
    } else {
        showMovie(SEARCH_API_URL + e.target.value)
    }
})


// nav menu click
const navClick = (e) => {
    let queryurl = null;

    if(e.target.tagName === "LI") {

        Array.from(NAV_UL.children).forEach((item) => {
            item.classList.remove("active")
        })

        if(e.target.textContent === "Home") {
            queryurl = API_URL;
            e.target.classList.add("active")
        } else if(e.target.textContent === "Action") {
            queryurl = GENRE_API_URL + 28
            e.target.classList.add("active")
        } else if(e.target.textContent === "Adventure") {
            queryurl = GENRE_API_URL + 12
            e.target.classList.add("active")
        } else if(e.target.textContent === "Horror") {
            queryurl = GENRE_API_URL + 27
            e.target.classList.add("active")
        } else if(e.target.textContent === "Thriller") {
            queryurl = GENRE_API_URL + 53
            e.target.classList.add("active")
        } else if(e.target.textContent === "Sci-fi") {
            queryurl = GENRE_API_URL + 878
            e.target.classList.add("active")
        }

        showMovie(queryurl)
        CLOSE_MOBILE_MENU()
        HAMBURGER_TOGGLE_ICON()
        queryurl = null;
    }
}

NAV_UL.addEventListener("click", navClick)

// default page when clicked on logo
LOGO.addEventListener("click", () => showMovie(API_URL))

// Mobile menu
HAMBURGER_BUTTON.addEventListener("click", (e) =>  {
    e.stopPropagation()
    NAV_UL.classList.toggle("active")
    HAMBURGER_BUTTON.firstElementChild.classList.toggle("fa-xmark")
    OVERLAY.classList.toggle("active")
    BODY.classList.toggle("active")
})


// close mobile Menu
const CLOSE_MOBILE_MENU = () => {
    if(NAV_UL.classList.contains("active")) {
        NAV_UL.classList.remove("active")
        OVERLAY.classList.remove("active")
        BODY.classList.remove("active")
    }
}

// hamburger icon from bar to cross
const HAMBURGER_TOGGLE_ICON = () => {
    if(HAMBURGER_BUTTON.firstElementChild.classList.contains("fa-xmark")) {
        HAMBURGER_BUTTON.firstElementChild.classList.remove("fa-xmark")
    }
}

// search button in mobile
SEARCH_BUTTON.addEventListener("click", () =>  {
    SEARCH_FORM.classList.toggle("active")
    CLOSE_MOBILE_MENU()
    HAMBURGER_TOGGLE_ICON()
})

// search form
SEARCH_FORM.addEventListener("click", () => {
    CLOSE_MOBILE_MENU()
    HAMBURGER_TOGGLE_ICON()
})

// Search close button
SEARCH_FORM.firstElementChild.addEventListener("click", (e) =>  {
    e.preventDefault()
    SEARCH_FORM.classList.toggle("active")
})

// Form inner search button

SEARCH_FORM.lastElementChild.addEventListener("click", () => {
    if(SEARCH_FORM.classList.contains("active")) {
        SEARCH_FORM.classList.remove("active")
    }
})

// Modal Close button
MODAL.lastElementChild.addEventListener("click", (e) =>  {
    e.preventDefault()
    MODAL.classList.remove("active")
    OVERLAY.classList.remove("active")
    OVERLAY.style.zIndex = 4;
    BODY.classList.remove("active")
})

// back to top
window.addEventListener("scroll", () => {
    if(window.scrollY > 100) {
        BACK_TO_TOP.classList.add("active")
    } else {
        BACK_TO_TOP.classList.remove("active")
    }
})

BACK_TO_TOP.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
})

