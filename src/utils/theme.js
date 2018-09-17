import {ThemeBGC,ThemeColor} from '../defaultSettings'

export function setThemeBackGround(){
    const root = document.getElementById('root');
    const body = document.getElementsByTagName('body')[0];
    const html = document.getElementsByTagName('html')[0];
    // root.style.backgroundColor = Theme
    body.style.backgroundColor = ThemeBGC
    body.style.color = ThemeColor
    // html.style.backgroundColor = Theme
}
