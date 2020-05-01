import React, { Fragment, Component } from 'react';
import './App.css';
import 'bulma/css/bulma.css';
import ReactTooltip from "react-tooltip";
import PropTypes from 'prop-types';
import Resultado from './Resultado';
import Alertinha from './Alertinha';
import $ from 'jquery';

Resultado.propTypes = {
    closeModal: PropTypes.func.isRequired,
    modalState: PropTypes.bool.isRequired,
    titulo: PropTypes.string
}

Alertinha.propTypes = {
    fecharErro: PropTypes.func.isRequired,
    erroEstado: PropTypes.bool.isRequired,
    mensagem: PropTypes.string
}

class FormCalculadora extends Component {
    constructor(props) {
        super(props);

        this.state = {
            erroEstado: false,
            modalState: false,
            erros: {},
            value: 'Meses'
        };

        this.exibirModal = this.exibirModal.bind(this);
        this.exibirModalErro = this.exibirModalErro.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /*
        Se atentar para quando virar a tela do celular
    */

    validarCampos() {
        var inputIdade = document.getElementById("idade");
        var inputPeso = document.getElementById("peso");

        var erros = {};
        var validador = true;
        var obrigatorio = '* Campo obrigatório';
        if (inputIdade.value.length === 0) {
            document.getElementById("idade").classList.add("is-danger");
            validador = false;
            erros["idade"] = obrigatorio;
            $('.help.is-danger').show();
        }

        if (inputPeso.value.length === 0) {
            document.getElementById("peso").classList.add("is-danger");
            validador = false;
            erros["peso"] = obrigatorio;
            $('.help.is-danger').show();
        }

        if (validador) {
            inputIdade.classList.remove("is-danger");
            inputPeso.classList.remove("is-danger");
        }

        this.setState({ erros: erros });
        return validador;
    }

    getAlteracao(campo, e) {
        let campos = this.state.campos;
        campos[campo] = e.target.value;
        this.setState({ campo });
    }

    exibirModal() {
        this.setState((prev) => {
            const newState = !prev.modalState;
            return { modalState: newState };
        });
    }

    exibirModalErro() {
        this.setState((prev) => {
            const newState = !prev.erroEstado;
            return { erroEstado: newState };
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.validarCampos()) {
            if (this.validarMesMaiorQueDoze()) {
                this.exibirModalErro();
            } else {
                this.exibirModal();
            }
        }
    }

    validarMesMaiorQueDoze() {
        var inputMesesOuAnos = document.getElementById('mesesOuAnos').value;
        var idade = document.getElementById('idade').value;
        return (inputMesesOuAnos === 'Meses' && parseInt(idade) > 12);
    }

    removerCaracteres(input) {
        var inputElement = document.getElementById(input);
        inputElement.value = inputElement.value.replace(/\D/g, "");
    }

    limparInputs() {
        var inputIdade = document.getElementById("idade");
        inputIdade.classList.remove("is-danger");
        inputIdade.value = "";

        var inputPeso = document.getElementById("peso");
        inputPeso.classList.remove("is-danger");
        inputPeso.value = "";

        $('.help.is-danger').hide();
    }

    // formatarInputParaDecimal(input) {
    //     var inputElement = document.getElementById(input);
    //     inputElement.value = inputElement.value.replace(/\D/g, "");
    //     if (inputElement.value.length === 2 && inputElement.value.charAt(1) !== ",") {
    //         inputElement.value = inputElement.value.slice(0, 1) + "," + inputElement.value.slice(1, 2);
    //     } else if (inputElement.value.length === 3 && inputElement.value.charAt(2) !== ",") {
    //         inputElement.value = inputElement.value.slice(0, 2) + "," + inputElement.value.slice(2, 3);
    //     } else if (inputElement.value.length === 4 && inputElement.value.charAt(3) !== ",") {
    //         inputElement.value = inputElement.value.slice(0, 3) + "," + inputElement.value.slice(3, 4);
    //     }
    // }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    render() {
        return (
            <Fragment>
                <div className="divEnviarForm">
                    <form name="enviarForm" className="container-entrar-form entrar-form" onSubmit={this.handleSubmit}>
                        <div className="field has-addons">
                            <p className="control is-expanded">
                                <input id="idade" refs="idade" className="input" type="text" maxLength="2" placeholder="Idade"
                                    onInput={() => {
                                        this.getAlteracao.bind(this, "idade");
                                        this.removerCaracteres("idade");
                                    }} />
                                <span className="help is-danger">{this.state.erros["idade"]}</span>
                            </p>
                            <p className="control">
                                <span className="select">
                                    <select id="mesesOuAnos" value={this.state.value} onChange={this.handleChange}>
                                        <option value="Meses">meses</option>
                                        <option value="Anos">anos</option>
                                    </select>
                                </span>
                            </p>
                        </div>

                        <div className="field">
                            <div className="control">
                                <input id="peso" refs="peso" className="input" type="number" step="0.1" min="1" max="200" maxLength="5" placeholder="Peso"
                                    onInput={() => {
                                        this.getAlteracao.bind(this, "peso");
                                    }} />
                                <span className="help is-danger">{this.state.erros["peso"]}</span>
                            </div>
                        </div>

                        <div className="control">
                            <button type="submit" className="button has-text-white is-fullwidth is-minha-cor" data-tip="Calcular" data-for="calcularId">
                                Calcular
                            </button>
                            <ReactTooltip effect="solid" place="top" id="calcularId" />
                        </div>

                        <div className="control">
                            <button type="button" className="button has-text-white is-fullwidth is-danger mt10" data-tip="Limpar" data-for="limparId" onClick={this.limparInputs}>
                                Limpar
                            </button>
                            <ReactTooltip effect="solid" place="top" id="limparId" />
                        </div>
                        
                        <Alertinha
                            erroEstado={this.state.erroEstado}
                            fecharErro={this.exibirModalErro} 
                            mensagem='O valor da idade em "Meses" não pode ser maior que "12".'>
                        </Alertinha>

                        <Resultado
                            closeModal={this.exibirModal}
                            modalState={this.state.modalState}
                            titulo='Resultado'>
                        </Resultado>
                    </form>
                </div>
            </Fragment>
        );
    }
}
export default FormCalculadora;