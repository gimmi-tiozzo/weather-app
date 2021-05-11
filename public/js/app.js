const search = document.querySelector("#search");
const result = document.querySelector("#result");
const address = document.querySelector("#address");

search.addEventListener("click", (e) => {
    e.preventDefault();

    const location = address.value;
    result.innerHTML = "loading...";

    fetch(`/weather?address=${location}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw response;
            }
        })
        .then((json) => {
            if (json.error) {
                result.innerHTML = `Error: ${json.error.message}`;
            }

            result.innerHTML = `<p>${json.location}</p><p>${json.forecast}</p>`;
        })
        .catch((err) => {
            if (err.text && typeof err.text === "function") {
                err.text().then((txt) => {
                    result.innerHTML = `Http status code isn't OK: ${err.status} - ${err.statusText} - ${txt}`;
                });
            } else {
                result.innerHTML = `Error: ${err.message}`;
            }
        });
});
