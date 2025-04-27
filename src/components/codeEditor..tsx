import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import modeJava from "ace-builds/src-noconflict/mode-java?url";
import githubTheme from "ace-builds/src-noconflict/theme-github?url";
import { config } from "ace-builds";

config.setModuleUrl("ace/mode/java", modeJava);
config.setModuleUrl("ace/theme/github", githubTheme);

function CodeEditor({
                        code,
                        readonly,
                        onChange,
                        height,
                        language
                    }: {
    code?: string;
    readonly: boolean;
    onChange?: ((value: string, event?: any) => void) | undefined;
    height: string;
    language: 'java' | 'python' | 'c_cpp'
}) {

    console.log(language)
    return (
        <AceEditor
            width={"100%"}
            readOnly={readonly}
            height={height}
            value={code}
            mode={"java"}
            theme="monokai"
            fontSize="16px"
            highlightActiveLine={true}
            onChange={onChange}
            enableLiveAutocompletion={true}
            setOptions={{
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2
            }}
        />
    );
}

export default CodeEditor;