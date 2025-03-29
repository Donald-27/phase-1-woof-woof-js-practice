document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterBtn = document.getElementById("good-dog-filter");
    let showOnlyGoodDogs = false;

    function fetchDogs() {
        fetch("http://localhost:3000/pups")
            .then(response => response.json())
            .then(data => renderDogs(data));
    }

    function renderDogs(dogs) {
        dogBar.innerHTML = "";
        dogs.forEach(dog => {
            if (!showOnlyGoodDogs || dog.isGoodDog) {
                const span = document.createElement("span");
                span.textContent = dog.name;
                span.addEventListener("click", () => showDogDetails(dog));
                dogBar.appendChild(span);
            }
        });
    }

    function showDogDetails(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h2>${dog.name}</h2>
            <button id="toggle-dog">${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;
        
        document.getElementById("toggle-dog").addEventListener("click", () => toggleGoodDog(dog));
    }

    function toggleGoodDog(dog) {
        dog.isGoodDog = !dog.isGoodDog;
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isGoodDog: dog.isGoodDog })
        })
        .then(() => {
            showDogDetails(dog);
            fetchDogs();
        });
    }

    filterBtn.addEventListener("click", () => {
        showOnlyGoodDogs = !showOnlyGoodDogs;
        filterBtn.textContent = `Filter good dogs: ${showOnlyGoodDogs ? "ON" : "OFF"}`;
        fetchDogs();
    });

    fetchDogs();
});
