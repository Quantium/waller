import {UrlGetter} from './src/UrlGetter';
const website = 'https://wallpaperscraft.com/download/black_apple_bones_skull_26511/1440x900';

function getUrls(w = website){
  let getter = new UrlGetter(w,'base');
  getter.list.then(value => {
    console.log("list::",value);
  });
}

getUrls(website);
