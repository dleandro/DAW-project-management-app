package pt.isel.daw.g14.user

import pt.isel.daw.g14.common.SIREN_MEDIA_TYPE
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import pt.isel.daw.g14.common.LOGIN_USER_PATH
import pt.isel.daw.g14.common.ProblemJson
import pt.isel.daw.g14.common.USER_PATH
import java.security.InvalidParameterException

// TODO: Missing Error handling and response probably incomplete

// Access our Postman Collection to make the requests easily https://www.getpostman.com/collections/424e0af7546db7767fdc

@RestController
@RequestMapping( USER_PATH, produces = [SIREN_MEDIA_TYPE], headers = [ "Accept=application/json"])
class UserController {

    @Autowired
    private lateinit var userService: UserService

    @ExceptionHandler
    fun handleInvalidUsername(e: InvalidUsername) =
            ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/invalid-username",
                            title = "Invalid username",
                            detail = "The specified username is already in use",
                            status = 403
                    ))

    @ExceptionHandler
    fun handleUserNotFound(e: UserNotFound) =
            ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/user-not-found",
                            title = "Username not found",
                            detail = "The specified username doesn't exist",
                            status = 404
                    ))

    @ExceptionHandler
    fun handleWrongPassword(e: PasswordDoesntMatch) =
            ResponseEntity
                    .badRequest()
                    .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                    .body(ProblemJson(
                            type = "/problems/incorrect-password",
                            title = "Wrong Password",
                            detail = "The specified password doesn't match your username",
                            status = 400
                    ))

    @GetMapping
    fun getUser() =
            userService.getAllUsers()

    @PostMapping
    fun createUser(@RequestBody usersInputModel: UserInputModel) =
            userService.createUser(usersInputModel)

    @PostMapping(LOGIN_USER_PATH)
    fun loginUser(@RequestBody userToLogin: UserInputModel) =
            userService.userExists(userToLogin.username, userToLogin.password)

}