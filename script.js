
const projects = document.querySelector("#projects");

let userRaw = '';
let userData = [];
let userResults = [];
let userKeys = ["name", "description", "homepage", "html_url", "language", "clone_url", "git_url", "created_at", "stargazers_count", "watchers_count", "forks_count"];


function getRepos(dev){

  fetch(`https://api.github.com/users/${dev}/repos`, {method: "GET", mode: 'cors', headers: [
        ["Content-Type", "application/json"],
        ["Content-Type", "text/plain"]
      ] })
    .then( (response) => response.json() )
    .then( (json) => { userRaw = json;  console.log(userRaw);  })
    .then( () => { userRaw.forEach(elem => userData.push(elem)) })
    .then( () => { userData.forEach(obj => userResults.push(extract(obj, ...userKeys)))})
    .then( () => createProjectContent() );
}


const extract = (obj, ...keys) => {
  const newObject = Object.assign({});
  Object.keys(obj).forEach((key) => {
     if(keys.includes(key)){
        newObject[key] = obj[key];
        delete obj[key];
     };
  });
  return newObject;
};


function createProjectContent(){
  userResults.forEach( (item) => {
    const box = document.createElement("div");
    const title = document.createElement("div");
    const lang = document.createElement("div");
    const name = document.createElement("div");
    const desc  = document.createElement("div");
    const actions = document.createElement("div");
    const repo = document.createElement("a");
    const live = document.createElement("a");
    const star = document.createElement("span");
    const watch = document.createElement("span");
    const fork = document.createElement("span");
    const lang_icon = document.createElement("span");
    const repo_icon = document.createElement("span");
    const live_icon = document.createElement("span");
    let i = getDevIcon(item);

    if( i == "mdi-null"){
      lang_icon.classList = ["lang iconify"];
      lang_icon.setAttribute("data-icon", i);
    } else {
      lang_icon.classList = [`devicon ${i}`];
    }

    title.classList = ["project-title"];
    name.classList = ["project-name"];
    name.textContent = item.name;
    lang.classList = ["lang"];
    desc.classList = ["project-description"];
    desc.textContent = item.description;
    repo_icon.classList = ["iconify"];
    repo_icon.setAttribute("data-icon", "mdi-source-repository");
    live_icon.classList = ["iconify"];
    live_icon.setAttribute("data-icon", "mdi-application-outline");
    repo.href = item.html_url;
    repo.setAttribute("target", "_blank");
    repo.append(repo_icon);
    live.href = item.homepage;
    live.setAttribute("target", "_blank");
    live.append(live_icon);
    star.classList = ["iconify"];
    star.setAttribute("data-icon", "mdi-star-outline");
    star.insertAdjacentText("beforeend", "0");
    watch.classList = ["iconify"];
    watch.setAttribute("data-icon", "mdi-eye-outline");
    fork.classList = ["iconify"];
    fork.setAttribute("data-icon", "mdi-source-fork");
    
    actions.className = ["project-info-icons"];
    actions.append(repo);
    actions.append(live);
    actions.append(star);
    actions.insertAdjacentText("beforeend", `${item.stargazers_count} `);
    actions.append(watch);
    actions.insertAdjacentText("beforeend", `${item.watchers_count} `);
    actions.append(fork);
    actions.insertAdjacentText("beforeend", `${item.forks_count} `);
    lang.append(lang_icon);
    title.append(name);
    title.append(lang);
    box.append(title);
    box.append(desc);
    box.append(actions);
    box.classList = ["project-card"];
    projects.append(box);
  });
}

const getDevIcon = (item) => {
  switch(item.language){
    case null : return "mdi-null";
    case "CSS" : return "devicon-css3-plain-wordmark colored";
    case "JavaScript" : return "devicon-javascript-plain colored";
    case "Java" : return "devicon-java-plain colored"
    case "HTML" : return "devicon-html5-plain-wordmark colored";
    case "PHP" : return "devicon-php-plain colored";
    case "Python" : return "devicon-python-plain colored";
    case "Dart" : return "devicon-dart-plain colored";
    case "Go" : return "devicon-go-plain colored";
    case "C#" : return "devicon-csharp-plain colored";
    case "TypeScript" : return "devicon-typescript-plain colored";
    case "SCSS" : return "devicon-sass-original colored";
    case "SASS" : return "devicon-sass-original colored";
    case "Jupyter Notebook" : return "devicon-jupyter-plain-wordmark colored";
    case "C" : return "devicon-c-plain-wordmark colored";
    case "C++" : return   "devicon-cplusplus-plain-wordmark colored";
    case "Shell" : return "devicon-bash-plain ";
    case "VimL" : return "devicon-vim-plain colored";
    case "Dockerfile" : return "devicon-docker-plain-wordmark colored";
    case "Vim script"  : return "devicon-vim-plain colored";
    case "Ruby" : return "devicon-ruby-plain colored";
    case "Nginx" : return "devicon-nginx-original-wordmark colored";
    case "Lua" : return "devicon-lua-plain-wordmark colored";
    case "CMake" : return "devicon-cmake-plain colored";
    case "Swift" : return "devicon-swift-plain colored";
    case "Rust" : return "devicon-rust-plain colored";
    case "OCaml" : return "devicon-ocaml-plain-wordmark colored";
    case "Clojure" : return "devicon-clojure-plain colored";
    case "Solidity" : return "devicon-solidity-plain";
    case "Kotlin" : return "devicon-kotlin-plain-wordmark colored";
    case "Scala" : return "devicon-scala-plain-wordmark colored"; 
    case "Arduino" : return "devicon-arduino-plain-wordmark colored";
    case "Zig" : return "devicon-zig-plain-wordmark colored";
    case "R" : return "devicon-r-plain colored";
    case "Objective-C" : return "devicon-objectivec-plain";
    case "Elixir" : return "devicon-elixir-plain-wordmark colored";
    case "CoffeeScript" : return "devicon-coffeescript-original-wordmark colored";
    case "Svelte" : return  "devicon-svelte-plain-wordmark colored";
    case "Vue" : return "devicon-vuejs-plain-wordmark colored";
    case "Perl" : return "devicon-perl-plain colored";
    case "F#" : return "devicon-fsharp-plain colored";
     // case "" : return ;
    default : return "mdi-null"; 
  }
};

getRepos("tlonuqbar");