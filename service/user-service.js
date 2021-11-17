const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')

class UserService {
    async registration(email, password) {        
        const candidate = await UserModel.findOne({ email })
        // проверка почты пользователя, если есть выводим ошибку
        if (candidate) {
            throw new Error(
                `Пользователь с почтовым адресом ${email}уже существует`
            )
        }
        // хэшируем пароль и делаем ссылку для активации 
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()
        // сохраняем пользователя в бд
        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink,
        })
        await mailService.sendActivationMail(email, activationLink)
        // отправляем на почту письмо для активации,генерируем токены и сохраняем refresh токен в бд
        // и по итогу из функции возвращаем информацию о пользователе и токены
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }
}

module.exports = new UserService()
