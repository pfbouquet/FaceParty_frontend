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
