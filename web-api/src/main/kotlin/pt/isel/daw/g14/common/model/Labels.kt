package pt.isel.daw.g14.common.model

import java.io.Serializable

class Labels(
        var presentLabel: String = "",
        private val labelsList: List<String> = listOf("DEFECT", "NEW_FUNCTIONALITY", "EXPLORATION")
): Serializable {

    fun changePresentLabel(newLabel: Labels): Boolean {
        return if (labelsList.contains(newLabel.presentLabel)) {
            presentLabel = newLabel.presentLabel
            true
        } else
            false
    }

    fun checkIfLabelIsExistent() =
            labelsList.contains(presentLabel) || presentLabel == ""
}