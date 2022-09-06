package pt.isel.daw.g14.home

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import pt.isel.daw.g14.common.*
import java.net.URI


@RestController
class HomeController {

    @GetMapping(value = [HOME_PATH], produces = [JSON_HOME_MEDIA_TYPE])
    fun getNavigation(): Navigation {
        return Navigation(
                ApiInfo("HVAC Web API", mapOf(
                        "author" to listOf(URI("mailto:matiastiago99@gmail.com"),
                        URI("mailto:joaobarata245@gmail.com"),
                        URI("mailto:a44868@alunos.isel.pt")),
                        "describedBy" to listOf(URI("https://github.com/A44857/DAW-1920v-LI61D-G14")))
                ),
                Resources(
                        issue = NavigationLink(ISSUE_PATH),
                        project = NavigationLink(PROJECT_PATH),
                        user = NavigationLink(USER_PATH)
                )
        )
    }
}