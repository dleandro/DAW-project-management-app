package pt.isel.daw.g14.user

import org.springframework.data.repository.CrudRepository


interface UserRepository : CrudRepository<UserInputModel, String>{

}