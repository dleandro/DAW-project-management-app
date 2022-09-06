package pt.isel.daw.g14.common.model

import java.io.Serializable

class ListOfItemsWrapper(var items: MutableList<String>): Serializable {

    fun addComments(presentIssueState: State, newListOfItemsWrapper: ListOfItemsWrapper): Boolean {
        return if (presentIssueState.presentState == "ARCHIVED") {
            false
        } else {
            items.addAll(newListOfItemsWrapper.items)
            true
        }
    }


}