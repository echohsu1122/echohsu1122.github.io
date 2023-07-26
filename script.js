/////header menu//
const menuBar = document.querySelector(".fa-bars");
const wrap_app_header = document.querySelector(".wrap_app_header");
menuBar.addEventListener("click", () => {
  menuBar.classList.toggle("active");
  if (menuBar.classList.contains("active")) {
    wrap_app_header.style.display = "flex";
    wrap_app_header.style.opacity = 1;
  } else {
    wrap_app_header.style.display = "none";
  }
});

//// search part ////
/*
const searchBtn = document.querySelector(".search-views");
const dropdownArea = document.querySelector(".dropdown-container");
searchBtn.addEventListener("click", () => {
  searchBtn.classList.toggle("active");
  if (searchBtn.classList.contains("active")) {
    dropdownArea.style.display = "block";
    console.log(searchBtn.classList);
  } else {
    dropdownArea.style.display = "none";
  }
});*/

/*Card*/
let cityQuery = document.querySelector("#city");
let selecCity = document.querySelector("#selecCity");
let cardContainer = document.querySelector(".card-container");
let searchCity = "";
let selectOption = "ScenicSpot";
let skip = 0;
let access_token = "";
let ScenicSpotUrl;
let ScenicSpotdata = [];
let str = "";
let ScenicSpot = document.querySelector("#ScenicSpot");
let Hotel = document.querySelector("#Hotel");
let Restaurant = document.querySelector("#Restaurant");
let dataUnfide = false;
/*get response */
setTimeout(() => {
  access_token = "";
}, 21600);
async function getResponse(selectOption, searchCity) {
  selectUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism/${selectOption}/${searchCity}?%24filter=Picture%2FPictureUrl1%20ne%20null%20and%20Picture%2FPictureDescription1%20ne%20null&%24top=50&%24skip=${skip}&%24format=JSON`;
  console.log(selectUrl);
  console.log(access_token);
  if (access_token == "") {
    await fetchAccessToken();
  }
  const response = await fetch(selectUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
      authorization: "Bearer " + access_token,
    },
  }).catch((error) => {
    console.log(`出現錯誤${error}`);
    console.log(`fetchAccessToken();`);
  });

  return response.json();
}

const searchInput = document.querySelector("#search-text");
searchInput.addEventListener("input", (e) => {
  const cards = document.querySelectorAll(".card");
  const value = e.target.value;

  cards.forEach((card) => {
    console.log(card.dataset.info);
    if (card.dataset.info.includes(value)) {
      return (card.style.display = "block");
    } else {
      card.style.display = "none";
    }
  });
});

async function getData(selectOption, searchCity, skip) {
  const datas = await getResponse(selectOption, searchCity, skip);

  if (datas.length == 0 && skip == 0) {
    str = `<h3>抱歉，本地區查無相關資料</h3>`;
    dataUnfide = true;
    document.querySelector("footer").style.marginTop = "65vh";
  } else {
    if (datas.length == 0 && skip > 0) {
      console.log(datas.length, skip);
      document.querySelector("#dataEnd").innerHTML = "資料結束";
      // document.querySelector("footer").style.marginBottom = "65vh";
    } else if (selectOption === "Restaurant") {
      datas.forEach((data) => {
        let description;
        if (data === undefined) return;
        if (data.Description) {
          description = "沒有相關資料";
        } else {
          description = data.Description;
        }
        str += `<figure class="card" data-info='${data.Address}'>
                <img
                    src='${data.Picture.PictureUrl1.replace("_thumb", "")}'
                    alt='${data.Picture.PictureDescription1}'
                     loading='lazy'
                    width='398.4' height='265.6'
                />
                
                <figcaption class="card-body">
                  <h3 class="name">${data.RestaurantName}</h3>
                  <h5 class="sub-title">地址:</h5>
                  <span>${data.Address}</span>
                  <h5>聯絡電話: </h5><span>${data.Phone}</span>  
                </figcaption>
             
                <div class="info">
                  <p class="card-text">
                    營業時間: ${data.OpenTime}
                </p>
              </div>
            </figure>`;
      });
    } else if (selectOption === "Hotel") {
      datas.forEach((data) => {
        // data.Picture.PictureUrl1.replace("_thumb", "");
        let description;
        if (data === undefined) return;
        if (data.Description === undefined) {
          description = "沒有相關資料";
        } else {
          description = data.Description;
        }
        str += `<figure class="card"  data-info='${data.Address}${description}'>
                <img
                    src='${data.Picture.PictureUrl1.replace("_thumb", "")}'
                    alt='${data.Picture.PictureDescription1}'
                     loading='lazy'
                    width='398.4' height='265.6'
                />
                <figcaption class="card-body">
                  <h3 class="name">${data.HotelName}</h3>
                  <h5 class="sub-title">地址:</h5><span>${data.Address}</span>
                  <h5 >聯絡電話: </h5><span>${data.Phone}</span>
                  
                </figcaption>
                <div class="info">
                  <p class="card-text">
                  ${description}
                </p>
                  </div>
            </figure>`;
      });
    } else {
      /*景點部分 */

      datas.map((data) => {
        let description;
        let city;
        let address;
        if (data === undefined) return;
        if (data.Description === undefined || data.Address === undefined) {
          description = "沒有相關資料";
        } else {
          description = data.Description;
        }
        if (data.Address === undefined) {
          address = "沒有相關資料";
        } else {
          address = data.Address;
        }
        if (data.City === undefined) {
          // console.log(data.Address);

          city = data.Address.slice(0, 3);
        } else {
          city = data.City;
        }

        str += `<figure class="card" data-info='${city}${address}${description}' 
                >
                <img
                    src='${data.Picture.PictureUrl1.replace("_thumb", "")}'
                    alt='${data.Picture.PictureDescription1}'
                    loading='lazy'
                    width='398.4' height='265.6'
                 
                />
                <figcaption class="card-body">
                  <h3 class="name">${city}</h3>
                  <h5 class="sub-title">${data.ScenicSpotName}</h5>
                  <span class="card-address">地址: ${address}</span>
                </figcaption>
                 <div class="info">
                 <p class="card-text">
                  ${description}
                </p>
              </div>
            </figure>`;
      });
    }
  }

  cardContainer.innerHTML = str;

  const cards = document.querySelectorAll(".card");
  console.log(cards);
  cards.forEach((card) => {
    const img = card.querySelector("img");
    console.log(img);
    function loadImg() {
      card.classList.add("loaded");
    }
    console.log(img.complete);
    if (img.complete) {
      loadImg();
    } else {
      img.addEventListener("load", loadImg);
    }
  });
}

/*API TOKEN 有存取限制*/

const fetchAccessToken = async () => {
  let auth_url =
    "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
  await fetch(auth_url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Content-Encoding": "br gzip",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "gg9641220003-f109af22-edd0-487f",
      client_secret: "fa11ee64-0951-4782-b772-bf8c40281b13",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      access_token = data.access_token;
      console.log(access_token);
    })
    .catch((error) => console.log(error));
};

// getData();
cityQuery.addEventListener("change", (e) => {
  str = "";
  skip = 0;
  selecCity.innerHTML = e.target.selectedOptions[0].innerHTML;
  searchCity = e.target.value;
  if (searchCity === "All") {
    searchCity = "";
  }
  selectOption = "ScenicSpot";
  ScenicSpot.style.backgroundColor = "var(--select-button)";
  [Hotel, Restaurant].forEach((btn) => {
    btn.classList.remove("active");
    btn.style.backgroundColor = "inherit";
  });
  getData(selectOption, searchCity, skip);
});

ScenicSpot.addEventListener("click", () => {
  str = "";
  skip = 0;
  selectOption = "ScenicSpot";
  ScenicSpot.classList.toggle("active");
  [Hotel, Restaurant].forEach((btn) => {
    btn.classList.remove("active");
    btn.style.backgroundColor = "inherit";
  });
  if (ScenicSpot.classList.contains("active")) {
    ScenicSpot.style.backgroundColor = "var(--select-button)";
  }
  getData(selectOption, searchCity);
});

Hotel.addEventListener("click", () => {
  str = "";
  skip = 0;
  selectOption = "Hotel";
  Hotel.classList.toggle("active");
  [ScenicSpot, Restaurant].forEach((btn) => {
    btn.classList.remove("active");
    btn.style.backgroundColor = "inherit";
  });
  if (Hotel.classList.contains("active")) {
    Hotel.style.backgroundColor = "var(--select-button)";
  }
  getData(selectOption, searchCity, skip);
});

Restaurant.addEventListener("click", () => {
  str = "";
  skip = 0;
  selectOption = "Restaurant";
  Restaurant.classList.toggle("active");
  [Hotel, ScenicSpot].forEach((btn) => {
    btn.classList.remove("active");
    btn.style.backgroundColor = "inherit";
  });
  if (Restaurant.classList.contains("active")) {
    Restaurant.style.backgroundColor = "var(--select-button)";
  }
  getData(selectOption, searchCity, skip);
});

/*IntersectionObserver */

document.addEventListener("DOMContentLoaded", () => {
  let options = {
    root: null,
    rootMargin: "70%",
    threshold: 0.2,
  };
  // fetchAccessToken();
  getData(selectOption, searchCity, 0);

  const observer = new IntersectionObserver(load, options);

  if (dataUnfide) {
    observer.unobserve(document.querySelector("footer"));
  } else {
    observer.observe(document.querySelector("footer"));
  }
});

function load(entries) {
  skip += 50;
  console.log(skip);
  if (entries[0].isIntersecting) {
    console.warn("in view");
    getData(selectOption, searchCity, skip);
  }
}

let upToTop = document.querySelector("#up");
upToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
