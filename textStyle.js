export function applyTextStyle(line, isSelected) {
    if (isSelected) {
        line.style.color = '#00aaff';
        line.style.textShadow = '0 0 0.75px rgba(0,170,255,0.5), 0.75px 0 1.5px rgba(0,170,255,0.5), -0.75px 0 1.5px rgba(0,170,255,0.5)';
    } else {
        line.style.color = '#00ff00';
        line.style.textShadow = '0 0 0.75px rgba(0,255,0,0.5), 0.75px 0 1.5px rgba(0,255,0,0.5), -0.75px 0 1.5px rgba(0,255,0,0.5)';
    }
}

export function getFileTextStyle() {
    return {
        color: '#00ff00',
        textShadow: '0 0 0.75px rgba(0,255,0,0.5), 0.75px 0 1.5px rgba(0,255,0,0.5), -0.75px 0 1.5px rgba(0,255,0,0.5)'
    };
}