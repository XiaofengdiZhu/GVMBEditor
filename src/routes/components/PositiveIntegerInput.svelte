<script lang="ts">
    import Textfield
        from "@smui/textfield";
    import IconButton
        from "@smui/icon-button";
    import HelperText
        from "@smui/textfield/helper-text";
    import {
        any2PositiveInteger
    } from "../Converter";

    export let label: string = "";
    export let value: number = 0;
    export let resetValue: number;
    export let afterChangeHandler;
    let invalid = false;

    function change({target}: Event) {
        let num = any2PositiveInteger(target.value);
        if (num > 0) {
            afterChangeHandler(num);
        }
    }

    function input({target}: Event) {
        let num = any2PositiveInteger(target.value);
        if (num > 0) {
            value = num;
        }
    }
</script>
<div>
    <Textfield {invalid} {label} on:change={change} on:input style="max-width: 6.5em" type="number" {value} variant="filled" withTrailingIcon={resetValue != null && value!==resetValue}>
        <HelperText slot="helper" validationMsg={invalid}>{invalid ? "错误！" : "十进制"}</HelperText>
        <svelte:fragment slot="trailingIcon">
            {#if resetValue != null && value !== resetValue}
                <IconButton class="material-icons" on:click={() => value=resetValue} size="button">
                    restart_alt
                </IconButton>
            {/if}
        </svelte:fragment>
    </Textfield>
</div>