package pt.isel.daw.g14.user

import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import pt.isel.daw.g14.common.*
import java.net.URI
import javax.persistence.Entity
import javax.persistence.Id

/**
 * This file has all the representations for user objects and all user management exceptions
 */

class InvalidUsername: Exception()

class UserNotFound: Exception()

class PasswordDoesntMatch: Exception()

// possible actions you can do to issues (Siren documentation)
val CREATE_USER_ACTION = SirenAction(
        name = "create-user",
        title = "Create User",
        href = URI(USER_PATH),
        method = HttpMethod.POST,
        type = MediaType.APPLICATION_FORM_URLENCODED,
        fields = listOf(
                SirenAction.Field("username", "string"),
                SirenAction.Field("password", "string"))
)

/**
 * This class is a jpa entity present in our database,
 * post requests create an object with these parameters
 */
@Entity
class UserInputModel (@Id
                      val username: String,
                      val password: String) {}


/**
 * Represents projects as reported by our API
 *
 * @property    userInputModel     The project received
 */
class UserOutputModel(val user: UserInputModel?) {
    fun toSirenObject(selfUri: URI, actions: List<SirenAction>? = null) = SirenEntity(
            properties = this,
            clazz = listOf("User"),
            links = listOf(SirenLink(rel = listOf("self"), href = selfUri)),
            actions = actions
    )
}