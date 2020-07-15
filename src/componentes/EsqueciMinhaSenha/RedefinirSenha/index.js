import React, {useState} from "react";
import {Redirect, useParams} from 'react-router-dom';
import {Formik} from "formik";
import {redefinirMinhaSenha} from "../../../services/auth.service";
import {medidorForcaSenha} from "../../../utils/MedidorForcaSenha";

export const RedefinirSenha = () => {

    let {uuid} = useParams();

    const initialValues = {
        senha: "",
        confirmacao_senha: "",
    };

    const [btnOnsubmitReadOnly, setBtnOnsubmitReadOnly] = useState(true);
    const [senhaRedefinida, setSenhaRedefinida] = useState(false);
    const [msgErro, setMsgErro] = useState(false);

    const onSubmit = async (values) =>{
        const payload ={
            "hash_redefinicao":uuid,
            "password": values.senha,
            "password2": values.confirmacao_senha
        };
        try {
            await redefinirMinhaSenha(payload);
            setSenhaRedefinida(true);
            setMsgErro(false)
        }catch (e) {
            console.log("Erro ao redefinir senha ", e);
            setMsgErro(true)
        }
    };

    const validateFormRedefinirSenha = async (values ) => {
        medidorForcaSenha(values, setBtnOnsubmitReadOnly)
    };

    return (
        <>
            <div className='container-esqueci-minha-senha'>
                <div className="esqueci-minha-senha-inner-texto">
                    <h1 className="titulo-services mb-3">Nova Senha</h1>
                    <p className='mt-3'>Identificamos que você ainda não definiu uma senha pessoal para acesso ao PTRF. Este passo é obrigatório para que você tenha acesso ao sistema</p>
                </div>

                <div className='col-12'>
                    <Formik
                        initialValues={initialValues}
                        validateOnBlur={true}
                        enableReinitialize={true}
                        onSubmit={onSubmit}
                        validate={validateFormRedefinirSenha}
                    >
                        {props => (
                            <form onSubmit={props.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="login">Nova Senha</label>
                                    <input
                                        type="text"
                                        value={props.values.senha}
                                        name="senha"
                                        id="senha"
                                        className="form-control"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                    {props.touched.senha && props.errors.senha && <span className="span_erro text-danger mt-1"> {props.errors.senha} </span>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="senha">Confirmação da Nova Senha</label>
                                    <input
                                        type="password"
                                        value={props.values.confirmacao_senha}
                                        name="confirmacao_senha"
                                        id="confirmacao_senha"
                                        className="form-control"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                    {props.touched.confirmacao_senha && props.errors.confirmacao_senha && <span className="span_erro text-danger mt-1"> {props.errors.confirmacao_senha} </span>}
                                </div>
                                <div className='form-group'>
                                    <p className='requisitos-seguranca-senha requisitos-seguranca-senha-validado'><strong>Requisitos de seguranca da senha:</strong></p>
                                    <p className='requisitos-seguranca-senha'><span id='letra_minuscula' className='pr-4'>Uma letra minúscula</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='letra_maiuscula' className='pr-4'>Uma letra maiúscula</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='senhas_iguais' className='pr-4'>As senhas devem ser iguais</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='espaco_em_branco' className='pr-4'>Não pode conter espaço em branco</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='caracteres_acentuados' className='pr-4'>Não podem conter caracteres acentuados</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='numero_ou_caracter_especial' className='pr-4'>Um número ou símbolo (caracter especial)</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='entre_oito_ate_doze' className='pr-4'>Deve ter no mínimo 8 e no máximo 12 caracteres</span></p>

                                    {btnOnsubmitReadOnly &&
                                        <p className="forca-senha-msg mt-3 p-2 text-center">Sua nova senha deve conter letras maiúsculas, minúsculas, números e símbolos. Por favor, digite outra senha</p>
                                    }
                                </div>
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={() => window.location.assign("/login")} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Sair</button>
                                    <button disabled={btnOnsubmitReadOnly} type="submit" className="btn btn-success mt-2">Continuar</button>
                                    {senhaRedefinida &&
                                    <Redirect
                                        to={{
                                            pathname: "/login",
                                            redefinicaoDeSenha: {
                                                msg: "Senha redefinida com sucesso",
                                                alertCss: "alert alert-success"
                                            }
                                        }}
                                        className="btn btn-success btn-block"
                                    />
                                    }
                                </div>
                            </form>
                        )}
                    </Formik>
                    {msgErro &&
                        <div className="alert alert-danger alert-dismissible fade show text-center" role="alert">
                            Erro ao redefinir a senha, tente novamente
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};