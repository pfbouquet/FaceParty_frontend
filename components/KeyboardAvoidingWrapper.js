// Composant qui permet d’éviter que le clavier masque les champs en rendant la vue scrollable et réactive à son apparition.
// présent dans app.js pour englober tout l'app
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const KeyboardAvoidingWrapper = ({ children }) => {
  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={20}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};
