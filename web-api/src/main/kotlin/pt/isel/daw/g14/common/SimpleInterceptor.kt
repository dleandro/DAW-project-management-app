package pt.isel.daw.g14.common


import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.web.method.HandlerMethod
import org.springframework.web.servlet.HandlerInterceptor
import pt.isel.daw.g14.user.UserService
import java.lang.Exception
import java.lang.reflect.Method
import java.util.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


class SimpleInterceptor(val userService: UserService) : HandlerInterceptor{



    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        val hm: HandlerMethod = try {
            handler as HandlerMethod
        } catch (e: ClassCastException) {
            return super.preHandle(request, response, handler)
        }

        val method: Method = hm.method

        if (method.isAnnotationPresent(RequiresAuthentication::class.java)) {

            if(!isAuthenticated(request)) {
                response.status = 401
                response.setHeader("WWW-Authenticate","Basic realm=\"App\"")
                return false
            }
        }

        return true
    }

    private fun isAuthenticated(req: HttpServletRequest): Boolean {
        val encodedString: String

        try {
           encodedString = req.getHeader("Authorization")
        } catch (err: Exception) {
            return false
        }
        val decodedArr=Base64.getDecoder().decode(encodedString).toString().split(":")

        return try {
            userService.userExists(decodedArr[0],decodedArr[1])
            true
        } catch (ex: Exception) {
            false
        }
    }

}

private fun Base64.Decoder.decode(encodedString: List<String>): Any {
    TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
}
