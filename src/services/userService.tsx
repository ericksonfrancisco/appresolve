import {
    createUserWithEmailAndPassword,
} from 'firebase/auth';
 
import {
    ref,
    set,
} from 'firebase/database';
 
import {
    auth,
    database,
} from './firebaseConfig';
 
import {
    UserModel,
} from '../models/UserModel';
//cadastrar no database do firebase
class UserService {
    async cadastrarUsuario(
        nome: string,
        celular: string,
        email: string,
        senha: string
    ): Promise<UserModel> {
 
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );
        //gera o id
        const uid =
            userCredential.user.uid;
 
        const usuario: UserModel = {
            id: uid,
            nome: nome,
            celular: celular,
            email: email,
            createdAt: new Date().toISOString(),
        };
 
        await set(
            ref(database, `usuarios/${uid}`),
            usuario
        );
 
        return usuario;
    }
}
 
export const userService = new UserService();

import {
    signInWithEmailAndPassword,
} from 'firebase/auth';

{/* ==================================
        AUTENTICAÇÃO DO USUÁRIO
================================== */}

export const loginUsuario = async (
    email: string,
    senha: string
) => {

    const emailFormatado = email.trim().toLowerCase();

    try {

        const resultado = await signInWithEmailAndPassword(
            auth,
            emailFormatado,
            senha
        );

        return {
            sucesso: true,
            usuario: resultado.user,
            mensagem: 'Login realizado com sucesso.',
        };

    } catch (error: any) {

        console.log('Erro no login:', error);

        let mensagem = 'Não foi possível realizar o login.';

        switch (error.code) {

            case 'auth/invalid-email':
                mensagem = 'O e-mail informado é inválido.';
                break;

            case 'auth/user-not-found':
                mensagem = 'Não existe uma conta cadastrada com este e-mail.';
                break;

            case 'auth/wrong-password':
                mensagem = 'Senha incorreta.';
                break;

            case 'auth/invalid-credential':
                mensagem = 'E-mail ou senha incorretos.';
                break;

            case 'auth/user-disabled':
                mensagem = 'Esta conta foi desativada.';
                break;

            case 'auth/too-many-requests':
                mensagem =
                    'Muitas tentativas de login. Tente novamente mais tarde.';
                break;

            case 'auth/network-request-failed':
                mensagem =
                    'Não foi possível conectar ao servidor. Verifique sua internet.';
                break;

            default:
                mensagem = 'E-mail ou senha incorretos.';
                break;
        }

        return {
            sucesso: false,
            usuario: null,
            mensagem,
        };
    }
};