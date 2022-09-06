package pt.isel.daw.g14

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.web.server.ConfigurableWebServerFactory
import org.springframework.boot.web.server.WebServerFactoryCustomizer
import org.springframework.context.annotation.Configuration
import org.springframework.http.MediaType
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.stereotype.Component
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import pt.isel.daw.g14.common.APPLICATION_TYPE
import pt.isel.daw.g14.common.JSON_HOME_SUBTYPE
import pt.isel.daw.g14.common.SimpleInterceptor
import pt.isel.daw.g14.user.UserService


@SpringBootApplication
class DawProjectApplication

fun main(args: Array<String>) {

	runApplication<DawProjectApplication>(*args)
}

@Component
class ServerPortCustomizer() : WebServerFactoryCustomizer<ConfigurableWebServerFactory> {

	override fun customize(factory: ConfigurableWebServerFactory) {
		factory.setPort(8082)
	}


}

@Configuration
@EnableWebMvc
class ApiConfig(val userService: UserService) : WebMvcConfigurer {

	override fun addInterceptors(registry: InterceptorRegistry) {
		registry.addInterceptor(SimpleInterceptor(userService))
	}

	override fun extendMessageConverters(converters: MutableList<HttpMessageConverter<*>>) {
		val converter = converters.find {
			it is MappingJackson2HttpMessageConverter
		} as MappingJackson2HttpMessageConverter
		converter.objectMapper.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
		converter.objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL)

		val jsonHomeConverter = MappingJackson2HttpMessageConverter()
		jsonHomeConverter.objectMapper.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
		jsonHomeConverter.objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL)
		jsonHomeConverter.supportedMediaTypes = listOf(MediaType(APPLICATION_TYPE, JSON_HOME_SUBTYPE))
		converters.add(jsonHomeConverter)
	}

}