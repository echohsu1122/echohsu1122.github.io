/////header menu//
const menuBar = document.querySelector(".fa-bars");
const wrap_app_header = document.querySelector(".wrap_app_header");
const container = document.querySelector(".container");
const homepage = document.querySelector(".homepage");
const logo = document.querySelector(".logo");
menuBar.addEventListener("click", () => {
  menuBar.classList.toggle("active");
  if (menuBar.classList.contains("active")) {
    wrap_app_header.style.display = "flex";
    wrap_app_header.style.opacity = 1;
  } else {
    wrap_app_header.style.display = "none";
  }
});
logo.addEventListener("click", () => {
  container.style.display = "none";
  homepage.style.display = "block";
});

/*Card*/
const cityQuery = document.querySelector("#city");
const selecCity = document.querySelector("#selecCity");
const cardContainer = document.querySelector(".card-container");
const searchInput = document.querySelector("#search-text");
const ScenicSpot = document.querySelector("#ScenicSpot");
const Hotel = document.querySelector("#Hotel");
const Restaurant = document.querySelector("#Restaurant");
const upToTop = document.querySelector("#up");
let searchCity = "";
let selectOption = "ScenicSpot";
let skip = 0;
let access_token = "";
let ScenicSpotUrl;
let ScenicSpotdata = [];
let str = "";

let dataUnfide = false;

setTimeout(() => {
  access_token = "";
}, 21600);

/*get response */
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
  });
  console.log(response.status);
  return response.json();
}

async function getData(selectOption, searchCity, skip) {
  const datas = await getResponse(selectOption, searchCity, skip);
  console.log(datas.length, skip);
  if (datas.length == 0 && skip == 0) {
    str = `<h3>抱歉，本地區查無相關資料</h3>`;
    dataUnfide = true;
    document.querySelector("footer").style.marginTop = "65vh";
  } else {
    console.log(datas.length);
    if (datas.length == 0 && skip > 0) {
      document.querySelector("#dataEnd").innerHTML = "資料結束";
      newBtn.style.display = "none";
    } else if (selectOption === "Restaurant") {
      datas.forEach((data) => {
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
                  <h5 class="address">地址:</h5>
                  <span>${data.Address}</span>
            
                </figcaption>
             
                <div class="info">
                  <div class="card-text">
                    <h5>聯絡電話: </h5><span>${data.Phone}</span>  
                    <h5>營業時間: </h5><span>${data.OpenTime}</span>
                </div>
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
                  <h5 class="address">地址:</h5><span>${data.Address}</span>
                  
                </figcaption>
                <div class="info">
                 <div class="card-text">
                    <h5>聯絡電話: </h5><span>${data.Phone}</span>  
                  </div>
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
                  <h3 class="name">${city}
                  <span class="sub-title">${data.ScenicSpotName}</span></h3>
                  <h5 class="address">地址:</h5><span>${address}</span>
                
                </figcaption>
                 <div class="info">
                  <div class="card-text">
                  ${description}
                </div>
              </div>
            </figure>`;
      });
    }
  }
  cardContainer.innerHTML = str;
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const img = card.querySelector("img");

    function loadImg() {
      card.classList.add("loaded");
    }

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
searchInput.addEventListener("input", (e) => {
  container.style.display = "block";
  homepage.style.display = "none";
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
cityQuery.addEventListener("change", (e) => {
  container.style.display = "block";
  newBtn.style.display = "block";
  homepage.style.display = "none";
  document.querySelector("#dataEnd").style.display = "none";
  str = "";
  skip = 0;
  selecCity.innerHTML = e.target.selectedOptions[0].innerHTML;
  searchCity = e.target.value;
  if (searchCity === "All") {
    searchCity = "";
  }
  selectOption = "ScenicSpot";
  [Hotel, Restaurant].forEach((btn) => {
    btn.classList.remove("active");
    btn.style.backgroundColor = "var(--background-color)";
    btn.style.color = "var(--font-color)";
  });

  ScenicSpot.style.backgroundColor = "var(--select-button)";
  ScenicSpot.style.color = "var(--select-btncolor)";

  getData(selectOption, searchCity, skip);
});

ScenicSpot.addEventListener("click", () => {
  str = "";
  skip = 0;
  selectOption = "ScenicSpot";
  ScenicSpot.classList.toggle("active");
  [Hotel, Restaurant].forEach((btn) => {
    btn.classList.remove("active");
    btn.style.backgroundColor = "var(--background-color)";
    btn.style.color = "var(--font-color)";
  });
  if (ScenicSpot.classList.contains("active")) {
    ScenicSpot.style.backgroundColor = "var(--select-button)";
    ScenicSpot.style.color = "var(--select-btncolor)";
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
    btn.style.backgroundColor = "var(--background-color)";
    btn.style.color = "var(--font-color)";
  });
  if (Hotel.classList.contains("active")) {
    Hotel.style.backgroundColor = "var(--select-button)";
    Hotel.style.color = "var(--select-btncolor)";
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
    btn.style.backgroundColor = "var(--background-color)";
    btn.style.color = "var(--font-color)";
  });
  if (Restaurant.classList.contains("active")) {
    Restaurant.style.backgroundColor = "var(--select-button)";
    Restaurant.style.color = "var(--select-btncolor)";
  }
  getData(selectOption, searchCity, skip);
});

/*IntersectionObserver */
const newBtn = document.createElement("button");
const strBtn = document.createTextNode("載入更多");
newBtn.appendChild(strBtn);
newBtn.classList.add("loadmore");
container.appendChild(newBtn);

newBtn.addEventListener("click", () => {
  // let options = {
  //   root: null,
  //   rootMargin: "70%",
  //   threshold: 0.2,
  // };
  // fetchAccessToken();
  // getData(selectOption, searchCity, 0);

  // const observer = new IntersectionObserver(load, options);

  // if (dataUnfide) {
  //   observer.unobserve(document.querySelector("footer"));
  // } else {
  //   observer.observe(document.querySelector("footer"));
  // }
  skip += 50;
  getData(selectOption, searchCity, skip);
});

// function load(entries) {
//   skip += 50;
//   console.log(skip);
//   if (entries[0].isIntersecting) {
//     console.warn("in view");
//     getData(selectOption, searchCity, skip);
//   }
// }

upToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
