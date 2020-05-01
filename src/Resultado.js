import React from "react";
import './App.css';
import 'bulma/css/bulma.css';
import $ from 'jquery';
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

const Resultado = ({ closeModal, modalState, titulo }) => {
    if (!modalState) {
        return null;
    }

    var valorDaIdade;
    var valorDoPeso;
    var valorDeMesesOuAnos;
    var valorEhEmAnos;

    function carregarValores() {
        var idade = document.getElementById("idade");
        var peso = document.getElementById('peso');
        var mesesOuAnos = document.getElementById('mesesOuAnos');
        
        valorDaIdade = parseInt(idade.value);
        valorDoPeso = parseFloat(peso.value.replace(',', '.'));
        valorDeMesesOuAnos = mesesOuAnos.value;
        valorEhEmAnos = valorDeMesesOuAnos === 'Anos';
    }
    
    function toFixed(value, valorDePrecisao) {
        var precisao = valorDePrecisao || 0,
            power = Math.pow(10, precisao),
            absValue = Math.abs(Math.round(value * power)),
            result = (value < 0 ? '-' : '') + String(Math.floor(absValue / power));

        if (precisao > 0) {
            var fraction = String(absValue % power),
                padding = new Array(Math.max(precisao - fraction.length, 0) + 1).join('0');
            result += '.' + padding + fraction;
        }
        return result;
    }

    function calcularValorPorQuilo(dosePorQuilo) {
        return toFixed(dosePorQuilo * valorDoPeso, 2);
    }

    function retornarResultado (doseMaxima, dosePorQuilo) {
        const resultado = calcularValorPorQuilo(dosePorQuilo);
        return resultado > doseMaxima ? doseMaxima : resultado;
    }

    function tranformarPontoParaVirgula(valor) {
        return valor.toString().replace('.', ',');
    }

    function calcularMidazolam(dose) {
        const idadeEmMeses = (valorDeMesesOuAnos === 'Meses' && valorDaIdade > 0);
        const idadeEmAnosMenorIgualACinco = (valorEhEmAnos && valorDaIdade <= 5);
        const idadeEmAnosMaiorDoQueCinco = (valorEhEmAnos && valorDaIdade > 5);

        if (idadeEmMeses || idadeEmAnosMenorIgualACinco) {
            return retornarResultado(1.20, dose);
        } else if (idadeEmAnosMaiorDoQueCinco) {
            return retornarResultado(2.00, dose);
        }
        return 0;
    }

    function imprimirResultado() {
        var telaDeImpressao = window.open();
        var tagDaHead;
        
        tagDaHead = document.createElement("link");
        tagDaHead.href = "https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css";
        tagDaHead.rel = "stylesheet";
        telaDeImpressao.document.head.append(tagDaHead);

        var tabela = document.getElementById('resultadoFinal');
        telaDeImpressao.document.body.append(tabela);

        $(telaDeImpressao.document).ready(function(){
            setTimeout(() => { telaDeImpressao.window.print(); }, 500);
        });
    }

    function calcularTot() {
        const valorDoTot = toFixed((valorDaIdade / 4) + 4, 2);
        return floor(valorDoTot, 0.5);
    }

    function retornarFórmulaNãoSeAplicaAIdade() {
        return 'Fórmula não se aplica à idade';
    }

    function retornarValorTot() {
        const valorDaIdadeEhEntreDoisEDez = (valorDaIdade >= 2 && valorDaIdade <= 10);
        const valorDaIdadeEhValido = (valorEhEmAnos && valorDaIdadeEhEntreDoisEDez);
        if (valorDaIdadeEhValido) {
            return calcularTot() + ' (Diminuir 0,5 se cuff)';
        }
        return retornarFórmulaNãoSeAplicaAIdade();
    }

    function calcularMarcaDoTuboNoDente() {
        const resultadoTot = calcularTot();
        if (retornarValorTot().includes('Fórmula')) {
            return retornarFórmulaNãoSeAplicaAIdade();
        }
        const resultadoMarcaDoTuboNoDente = resultadoTot * 3;
        return floor(resultadoMarcaDoTuboNoDente, 0.5);
    }

    function floor(value, step) {
        step || (step = 1.0);
        const inv = 1.0 / step;
        return Math.floor(value * inv) / inv;
    }

    $('#idade').on('input', carregarValores());
    $('#peso').on('input', carregarValores());
    $('#mesesOuAnos').on('change', carregarValores());

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={closeModal} />
            <div className="modal-card">
                <header className="modal-card-head is-minha-cor">
                    <p className="modal-card-title has-text-white">{titulo}</p>
                    <button className="delete" onClick={closeModal} />
                </header>
                <section className="modal-card-body is-paddingless	">
                    <div className="content">
                        <div id="resultadoFinal" className="content">
                            <div>
                                <p className="mt10 ml20"><strong>Idade:</strong> {valorDaIdade} {valorDeMesesOuAnos}<br/><strong>Peso:</strong> {valorDoPeso.toString().replace('.', ',')}kg</p>
                            </div>
                            <table className="table is-bordered is-narrow is-striped is-hoverable mt20" style={{marginBottom: 0}}>
                                <thead>
                                    <tr>
                                        <th className="has-text-centered vcentralizador" data-tip="Droga">Droga</th>
                                        <th className="has-text-centered vcentralizador" data-tip="Via">Via</th>
                                        <th className="has-text-centered vcentralizador" data-tip="Diluição">Diluição</th>
                                        <th className="has-text-centered vcentralizador" data-tip="Dose/ml">Dose/ml</th>
                                        <th className="has-text-centered vcentralizador" data-tip="Volume">Vol.</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {/*Adrenalina Venosa*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Adrenalina<br />0,1 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Diluído 1:9</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,1 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(retornarResultado(10.00, 0.1))} ml</td>
                                    </tr>
                                    {/*Adrenalina TOT*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Adrenalina<br />1 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">TOT</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,1 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(retornarResultado(2.50, 0.1))} ml</td>
                                    </tr>
                                    {/*Atropina*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered vcentralizador">Atropina<br />0,25 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Diluído 1:9</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,1 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-weight-bold">
                                            <p className="has-text-danger">
                                                {tranformarPontoParaVirgula(retornarResultado(2, 0.1))} ml<br/>(a cada 3-5 minutos)
                                            </p>(Dose máxima total é de 4 ml)
                                        </td>
                                    </tr>
                                    {/*Amiodarona*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Amiodarona<br />50 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,1 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-weight-bold">
                                            <p className="has-text-danger">
                                                {tranformarPontoParaVirgula(retornarResultado(6.00, 0.1))} ml
                                            </p>(Dose máxima total é de 0,3 ml/kg)
                                        </td>
                                    </tr>
                                    {/*Adenosina*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered vcentralizador">Adenosina<br />3 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">1ª dose:<br/>0,03 ml/kg<br/>2ª dose:<br/>0,06 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold is-marginless">
                                            <p>1ª dose: {tranformarPontoParaVirgula(retornarResultado(2.00, 0.03))} ml</p>
                                            <p>2ª dose: {tranformarPontoParaVirgula(retornarResultado(4.00, 0.06))} ml</p>
                                        </td>
                                    </tr>
                                    {/*Glicose*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Glicose<br />25%</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">2 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(calcularValorPorQuilo(2))} ml</td>
                                    </tr>
                                    {/*Bicarbonato de Na*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Bicarbonato<br />de Na 8,4%</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Diluído 1:1</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">2 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(calcularValorPorQuilo(2))} ml</td>
                                    </tr>
                                    {/*Sulfato de Magnésio 50%*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered vcentralizador">Sulfato de<br/>Magnésio 50%</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">5 g/10 ml = 500 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,1 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-weight-bold">
                                            <p className="has-text-danger">
                                                {tranformarPontoParaVirgula(retornarResultado(4.00, 0.1))} ml
                                            </p>(TV sem pulso = bolus / TV com pulso ou mal asmático = em 20 min.)
                                        </td>
                                    </tr>
                                    {/*SF 0,9% / RL*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">SF 0,9% / RL</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador"></td>
                                        <td className="is-size-7 has-text-centered vcentralizador">20 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(calcularValorPorQuilo(20))} ml</td>
                                    </tr>
                                    {/*Gluconato Calcio*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Gluconato<br />Calcio 10%</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador"></td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,6 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-weight-bold">
                                            <p className="has-text-danger">
                                                {tranformarPontoParaVirgula(calcularValorPorQuilo(0.60))} ml
                                            </p>(Correr lento)
                                        </td>
                                    </tr>
                                    {/*Midazolam*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Midazolam<br />5 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,04 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(calcularMidazolam(0.04))} ml</td>
                                    </tr>
                                    {/*Cetamina*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Cetamina<br />50 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,04 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(calcularValorPorQuilo(0.04))} ml</td>
                                    </tr>
                                    {/*Propofol*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Propofol<br />10 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,1 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(calcularValorPorQuilo(0.1))} ml</td>
                                    </tr>
                                    {/*Rocurônio*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Rocurônio<br />10 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,1 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(calcularValorPorQuilo(0.1))} ml</td>
                                    </tr>
                                    {/*Diazepam*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Diazepam<br />5 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,06 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(retornarResultado(4.00, 0.06))} ml</td>
                                    </tr>
                                    {/*Fenitoína*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered">Fenitoína<br />50 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Diluir</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,4 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-danger has-text-weight-bold">{tranformarPontoParaVirgula(retornarResultado(20.00, 0.4))} ml</td>
                                    </tr>
                                    {/*Fenobarbital*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered vcentralizador">Fenobarbital<br />100 mg/ml</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Diluir</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,2 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-weight-bold">
                                            <p className="has-text-danger">
                                                {tranformarPontoParaVirgula(retornarResultado(10.00, 0.2))} ml
                                            </p>(Dose máxima total é de 0,4 ml/kg)</td>
                                    </tr>
                                    {/*Lidocaína*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered vcentralizador">Lidocaína<br />2%</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Venosa</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">Pura</td>
                                        <td className="is-size-7 has-text-centered vcentralizador">0,05 ml/kg</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-weight-bold">
                                            <p className="has-text-danger">
                                                {tranformarPontoParaVirgula(retornarResultado(10.00, 0.05))} ml
                                            </p>(Dose máxima aculmulada é de 0,15 ml/kg)</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table is-bordered is-narrow is-striped is-hoverablex">
                                <tbody>
                                    {/*Tubo Traqueal TTO*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered vcentralizador w30p">Número do Tubo Traqueal (TOT)</td>
                                        <td id="valorDoTubo" className="is-size-7 has-text-centered vcentralizador has-text-weight-bold has-text-danger">
                                            {tranformarPontoParaVirgula(retornarValorTot())}
                                        </td>
                                    </tr>
                                    {/*Marca do Tubo no Dente*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered vcentralizador w30p">Marca do Tubo no dente</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-weight-bold has-text-danger">
                                            {tranformarPontoParaVirgula(calcularMarcaDoTuboNoDente())}
                                        </td>
                                    </tr>
                                    {/*Desfibrilação*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered vcentralizador w30p">Desfibrilação</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-weight-bold">
                                            <p className="has-text-danger is-marginless">
                                                {parseInt(calcularValorPorQuilo(2))} J
                                            </p>(Dobrar a dose na 2ª tentativa)<br/>(Máximo 10 J/kg)
                                            
                                        </td>
                                    </tr>
                                    {/*Cardioversão*/}
                                    <tr>
                                        <td className="is-size-7 has-text-centered vcentralizador w30p">Cardioversão</td>
                                        <td className="is-size-7 has-text-centered vcentralizador has-text-weight-bold">
                                            <p className="has-text-danger is-marginless">
                                                {parseInt(calcularValorPorQuilo(1))} J
                                            </p>(Ligar o sincronizador)<br/>(Máximo de 2 J/kg)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="ml20">
                            Referências Bibliográficas: <a className="has-text-link" href="https://g.co/kgs/cvioTm" target="_blank" rel="noopener noreferrer">Lexi-Comp's Pediatric Dosage Handbook: Including Neonatal Dosing, Drug Administration, & Extemporaneous Preparations. 24th edition</a>
                        </p>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <div className="is-pulled-right">
                        <button className="button is-info" data-tip="Imprimir" onClick={imprimirResultado}>
                            <FontAwesomeIcon icon={faPrint} />
                        </button>
                        <ReactTooltip effect="solid" place="top" />
                    </div>
                </footer>
            </div>
        </div>
    );
}
export default Resultado;