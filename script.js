
const projects = document.querySelector("#projects");
const events = document.querySelector(".events");
const repos = document.querySelector(".trending-repos");
const devs = document.querySelector(".trending-devs");
const dark = document.querySelector("#switcher");
const useDark = window.matchMedia("(prefers-color-scheme: dark)");
const section = document.querySelector("#p");

let theme = (window.matchMedia("(prefers-color-scheme: dark)").matches ) ? "dark" : "light" ;
let userRaw = '';
let userData = [];
let userResults = [];
let userKeys = ["name", "description", "homepage", "html_url", "language", "clone_url", "git_url", "created_at", "stargazers_count", "watchers_count", "forks_count"];
let userEventsRaw = '';
let userEventsResults = [];
let eventKeys = ["type", "created_at", "actor", "repo", "payload"];
let trendingRepos = '';
let trendyRepos = [];
let repoKeys = [ "author", "username", "avatar", "forks", "language", "name", "url", "stars", "description", "type"];
let trendingDevs = '';
let trendyDevs = [];
let devKeys = ["name", "description", "url", "avatar", "username", "repo"];
let find = document.querySelector("#find");
let search = document.querySelector("#search");
let user = "TlonUqbar";

let octiconsSet = { "WatchEvent" : ["octicon-star-16", "watching repo"], 
                    "PushEvent" : ["octicon-repo-push-16", "pushed to repo"], 
                    "CreateEvent" : ["octicon-repo-16", "created"], 
                    "ForkEvent" : ["octicon-repo-forked-16", "forked a repo"], 
                    "PullRequestEvent" : ["octicon-git-pull-request-16", "pull-request"], 
                    "PullRequestReviewEvent" : ["octicon-eye-16", "pull-request review"], 
                    "PullRequestReviewCommentEvent" : ["octicon-comment-discussion-16", "pull-request comment"],
                    "IssuesEvent" : ["octicon-issue-opened-16", "issue"],
                    "IssueCommentEvent" : ["octicon-comment-16","issue comment"], 
                    "DeleteEvent" : ["octicon-repo-deleted-16", "deleted"] 
                  }

let devName = ["TlonUqbar","Chalarangelo", "arvinxx", "wsxiaoys", "tmc", "SoftFever", 
    "dgtlmoon", "leecalcote", "rtsisyk", "wader", "homanp", "ralexstokes",
    "leerob", "stevearc", "jasnell", "justinmk", "SchrodingersGat", "stnguyen90",
    "shahednasser", "KieronQuinn", "deadprogram", "Nutlope", "castrojo", 
    "me-no-dev", "knadh", "donnemartin",
    "AliSoftware", "JonnyBurger", "a8m", "azure-sdk",  "jonatanklosko", 
    "OrKoN", "charliermarsh", "tklauser", "buger", "oobabooga", 
    "ClearlyClaire", "pilcrowOnPaper", "sobolevn","evereq", "casey", 
    "mazipan", "Vectorized","BloodAxe",
    "Jason2866", "aras-p", "andyzhangx", "jacoblee93", "Ebazhanov", 
    "emilk", "kelvins", "l-white", "eyurtsev", 
    "guillaumekln", "zeux", "yairm210", "drwpow", "kripken", "TheOdinProject", "luismadrigal", "carafelix"]


function getRepos(dev){
  userRaw = '';
  userData = [];
  userResults  = [];
  fetch(`https://api.github.com/users/${dev}/repos`, {method: "GET", mode: 'cors', headers: [
        ["Content-Type", "application/json"], ["Content-Type", "text/plain"]
      ] })
    .then( (response) => response.json() )
    .then( (json) => { userRaw = json; })
    .then( () => { userRaw.forEach(elem => userData.push(elem)) })
    .then( () => { userData.forEach(obj => userResults.push(extract(obj, ...userKeys)))})
    .then( () => createProjectContent() );
}

function getEvents(dev){
  userEventsRaw = '';
  userEventsResults = [];
  fetch(`https://api.github.com/users/${dev}/events?per_page=20`, {method: "GET", mode: 'cors', headers: [
    ["Content-Type", "application/json"], ["Content-Type", "text/plain"]
  ] })
    .then((response) => response.json())
    .then((json) => { userEventsRaw = json; })
    .then( () => (userEventsRaw.forEach(obj => userEventsResults.push(extract(obj, ...eventKeys)))) )
    .then( () => createEventsFeed());
}

function getTrendingRepos(){
  fetch(`https://api.gitterapp.com/repositories?since=daily`, {method: "GET", mode: 'cors', headers: [
    ["Content-Type", "application/json"], ["Content-Type", "text/plain"]
  ] })
    .then( (response) => response.json() )
    .then( (json) => { trendingRepos = json; })
    .then( () => {trendingRepos.slice(0,5).forEach( obj => {trendyRepos.push(extract(obj, ...repoKeys))}) })
    .then( () =>  createReposFeed() );
}


function getTrendingDevs(){
  fetch(`https://api.gitterapp.com/developers?since=daily`, {method: "GET", mode: 'cors', headers: [
    ["Content-Type", "application/json"], ["Content-Type", "text/plain"]
  ] })
    .then( (response) => response.json() )
    .then( (json) => { trendingDevs = json; })
    .then( () => { trendingDevs.slice(0,5).forEach( obj => {trendyDevs.push(extract(obj, ...devKeys))}) })
    .then( () => createDevsFeed() );
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
  if( user === "TlonUqbar"){
    t = `<div id='p' class='section-title'>Projects</div>` 
  } else {
    t = `<div id='p' class='section-title'>Projects for "${user}"</div>`
  }
  
  projects.innerHTML = t; 
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
    live_icon.setAttribute("data-icon", "mdi-web");
    repo.href = item.html_url;
    repo.setAttribute("target", "_blank");
    repo.setAttribute('title', "Repo")
    repo.append(repo_icon);
    if( item.homepage ){
      live.href = item.homepage;
      live.setAttribute("target", "_blank");
      repo.setAttribute('title', "Homepage")
      live.append(live_icon);
    }
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


function getOcticon(type){
  return octiconsSet[type];
}

function createEventsFeed(){
  
  if( user === "TlonUqbar"){
    t = `Activity` ;
  } else {
    t = `Activity for "${user}"`;
  }
  document.querySelector("#a").innerText = t;
  
  events.innerHTML  = '';
  userEventsResults.forEach( (item) => {
    const list = document.createElement("li");
    const icon = document.createElement("i");
    const stamp = document.createElement("span");
    const text = document.createElement("span");
    
    let type = item.type;
    let date = item.created_at;
    let ref_type = item.payload.ref_type;
    let action = item.payload.action;

    date = ` [${date.split("T")[0]}]`;
    type = getOcticon(type);

    icon.classList = [`octicons ${type[0]}`];
    text.classList  = ["event-desc"];

    if( !ref_type ) ref_type = ''
    text.textContent = (!action) ? `${type[1]} ${ref_type} ` : `${action} ${type[1]} `;

    stamp.classList = ['date'];
    stamp.textContent = date;  
    list.append(icon);
    list.append(text);
    list.append(stamp);
    events.append(list);
  })
}


function createReposFeed(){
  trendyRepos.forEach( (item) => {
    const avatar = document.createElement("div");
    const img = document.createElement("img");
    const name = document.createElement("div");
    const author = document.createElement("div");
    const url = document.createElement("a");
    const repo = document.createElement("div");

    img.classList = ["avatar-lg"];
    img.src = `${item.avatar}`;
    avatar.classList = ["repo-avatar"];
    avatar.append(img);
    url.setAttribute("target", "_blank");
    url.textContent = `${item.name}`;
    url.href = `${item.url}`;
    author.classList = ["repo-author"];
    author.textContent = `${item.author}`;
    name.classList = ["repo-name"];
    name.append(url);
    name.append(author);
    repo.append(avatar);
    repo.append(name);
    repo.classList = ["repo"];
    repos.append(repo);
  });
}


function createDevsFeed(){
  trendyDevs.forEach( (item) => {
    const avatar = document.createElement("div");
    const img = document.createElement("img");
    const name = document.createElement("div");
    const username = document.createElement("div");
    const url = document.createElement("a");
    const dev = document.createElement("div");

    img.classList = ["avatar-lg"];
    img.src = `${item.avatar}`;
    avatar.classList = ["repo-avatar"];
    avatar.append(img);
    url.setAttribute("target", "_blank");
    url.textContent = `${item.name}`;
    url.href = `${item.url}`;
    username.classList = ["repo-author"];
    username.textContent = `${item.username}`;
    name.classList = ["repo-name"];
    name.append(url);
    name.append(username);
    dev.append(avatar);
    dev.append(name);
    dev.classList = ["dev"];
    devs.append(dev);
  });
}


function findUser(username){
  username = ( search.value === '' ) ? devName[0] : search.value ;
  user = username;
  getRepos(username);
  getEvents(username);
}

getRepos(devName[0]);
getEvents(devName[0]);
getTrendingRepos();
getTrendingDevs();


function applyPreferredColorScheme(scheme) {
  for (var s = 0; s < document.styleSheets.length; s++) {

    for (var i = 0; i < document.styleSheets[s].cssRules.length; i++) {
      rule = document.styleSheets[s].cssRules[i];

      if (rule && rule.media && rule.media.mediaText.includes("prefers-color-scheme")) {
        switch (scheme) {
          case "light":
            rule.media.appendMedium("original-prefers-color-scheme");
            if (rule.media.mediaText.includes("light")) rule.media.deleteMedium("(prefers-color-scheme: light)");
            if (rule.media.mediaText.includes("dark")) rule.media.deleteMedium("(prefers-color-scheme: dark)");
            theme = "light";
            break;
          case "dark":
            rule.media.appendMedium("(prefers-color-scheme: light)");
            rule.media.appendMedium("(prefers-color-scheme: dark)");
            if (rule.media.mediaText.includes("original")) rule.media.deleteMedium("original-prefers-color-scheme");
            theme = "dark";
            break;
          default:
            rule.media.appendMedium("(prefers-color-scheme: dark)");
            if (rule.media.mediaText.includes("light")) rule.media.deleteMedium("(prefers-color-scheme: light)");
            if (rule.media.mediaText.includes("original")) rule.media.deleteMedium("original-prefers-color-scheme");
            break;
        }
      }
    }
  }
}

const toggleTheme = () => {
  if(theme == "dark"){
    applyPreferredColorScheme("light");
  } else {
    applyPreferredColorScheme("dark");
  }
}



dark.addEventListener( "click", toggleTheme);

find.addEventListener( "click", (e) => {
  console.log(search.value);
  findUser(search.value);
});