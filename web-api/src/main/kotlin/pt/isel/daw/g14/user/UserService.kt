package pt.isel.daw.g14.user

import org.mindrot.jbcrypt.BCrypt
import org.springframework.beans.factory.annotation.Autowired


import org.springframework.stereotype.Service
import pt.isel.daw.g14.common.PROJECT_PATH
import pt.isel.daw.g14.common.SirenEntity
import pt.isel.daw.g14.common.USER_PATH
import pt.isel.daw.g14.project.CREATE_PROJECT_ACTION
import pt.isel.daw.g14.project.ProjectOutputModel
import java.net.URI


@Service
class UserService(
        @Autowired private val repository: UserRepository) {

    fun userExists(username: String, password: String) =
        repository.findById(username).ifPresentOrElse(
                {
                    if (!BCrypt.checkpw(password, it.password)) {
                        throw PasswordDoesntMatch()
                    }
                },
                { throw UserNotFound() }
        )


    fun getAllUsers(): List<SirenEntity<UserOutputModel>> {
        val users = repository.findAll()

        if (users.any()) {

            return users.map {
                UserOutputModel(it)
                        .toSirenObject(URI(USER_PATH), listOf(
                                CREATE_USER_ACTION
                        ))
            }
        }
        return  listOf( UserOutputModel(null)
                .toSirenObject(URI(USER_PATH), listOf(
                        CREATE_USER_ACTION
                )))
    }


    fun createUser(usersInputModel: UserInputModel): Any {

        val passwordToSave = BCrypt.hashpw(usersInputModel.password, BCrypt.gensalt())

        return repository.save(UserInputModel(usersInputModel.username, passwordToSave))
    }

}