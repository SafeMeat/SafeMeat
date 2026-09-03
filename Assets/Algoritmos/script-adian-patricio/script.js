function calcular() {
    let pesoDaCarga = Number(ipt_pesoDaCarga.value);
    let custoSensor = Number(ipt_custoSensor.value);
    let valorKG = Number(ipt_valorKG.value);
    let porcentPerdaPeso = 0.02;
    let porcentRiscoRejeicao = 0.01;
    let reducao = 0.8;

    let valorCarga = pesoDaCarga * valorKG;

    let prejuizoPerda = valorCarga * porcentPerdaPeso;

    let prejuizoRejeicao = valorCarga * porcentRiscoRejeicao;

    let prejuizoTotal = prejuizoPerda + prejuizoRejeicao;

    let prejuizoEvitado = prejuizoTotal * reducao;

    let prejuizoRestante = prejuizoTotal - prejuizoEvitado;

    let economiaReal = prejuizoEvitado - custoSensor;

    if (economiaReal > 0) {
        msg.innerHTML += 'ação vantajosa<br>';
    } else if (economiaReal == 0) {
        msg.innerHTML += 'ação se paga<br>';
    } else {
        msg.innerHTML += 'ação não compensa<br>';
    }

    msg.innerHTML += `
        VALOR DA CARGA: ${valorCarga}<br>
        PREJUÍZO TOTAL: ${prejuizoTotal}<br>
        PREJUÍZO RESTANTE: ${prejuizoRestante}<br>
        CUSTO DA AÇÃO: R$${custoSensor}<br>
        ECONOMIA REAL: ${economiaReal}`;
}