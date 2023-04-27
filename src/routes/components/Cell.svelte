<script lang="ts">
    import Tooltip, {
        Wrapper
    } from '@smui/tooltip';
    import {
        createEventDispatcher,
        onMount
    } from "svelte";
    import {
        value2Alpha,
        value2Blue,
        value2Color,
        value2Green,
        value2Red,
        value2voltage,
        voltage2Value
    } from "../Converter";

    export let x: number;
    export let y: number;
    export let value: number = 0;
    $: voltage = value2voltage(value);
    let focusedColor: string = "transparent";
    let focusedHalfColor: string = "transparent";
    let valid: boolean = false;
    let focused: boolean = false;
    const dispatch = createEventDispatcher();

    function textChange({target}: Event): void {
        let newValue: number;
        try {
            newValue = voltage2Value(target.value);
        } catch (e) {
            target.value = voltage;
            dispatch('error', {
                title: "错误",
                message: "坐标(" + x + "," + y + "):" + e.message
            })
            return;
        }
        dispatch('change', {
            x: x,
            y: y,
            value: newValue
        });
    }

    function textInput({target}: Event) {
        let str = target.value;
        valid = str.replace(/[0-9a-f]/gi, '').length === 0 && str.replace(/0/g, '').length > 0
        if (valid) {
            value2twoColor(voltage2Value(str) & 0xFFFFFFFF);
        }
    }

    function value2twoColor(value) {
        let alphaValue = value2Alpha(value);
        let alpha = alphaValue.toString(16);
        let halfAlpha = Math.round(alphaValue / 4).toString(16);
        let blue = value2Blue(value).toString(16);
        let green = value2Green(value).toString(16);
        let red = value2Red(value).toString(16);
        focusedColor = '#' + (red.length < 2 ? '0' : '') + red + (green.length < 2 ? '0' : '') + green + (blue.length < 2 ? '0' : '') + blue + (alpha.length < 2 ? '0' : '') + alpha;
        focusedHalfColor = '#' + (red.length < 2 ? '0' : '') + red + (green.length < 2 ? '0' : '') + green + (blue.length < 2 ? '0' : '') + blue + (halfAlpha.length < 2 ? '0' : '') + halfAlpha;
    }

    onMount(() => {
        value2twoColor(value);
    })

    function textFocusIn() {
        focused = true;
    }

    function textFocusOut() {
        focused = false;
    }
</script>
<style>
    .CellBox {
        position: relative;
    }

    input {
        display: block;
        width: 5em;
        font-family: Roboto Mono;
        font-size: 1em;
        line-height: 1em;
        height: 1.4em;
        border-radius: 0;
        border-color: #d4d4d4;
        border-width: 1px;
        padding: 1px 1.4em 1px 2px;
    }

    input:focus-visible {
        outline: none;
    }

    input:invalid {
        color: red;
    }

    svg {
        display: block;
        position: absolute;
        right: calc(0.2em);
        top: calc(0.2em + 2px);
        width: calc(1em);
        height: calc(1em);
        cursor: pointer;
    }

    [tabindex='0'] {
        cursor: pointer;
    }
</style>
<Wrapper style="{focused?'z-index:2;':''}">
    <div class="CellBox" style="{focused?'z-index:2;':''}">
        <input title="({x},{y})" on:change={textChange} on:focusin={textFocusIn} on:focusout={textFocusOut} on:input={textInput} pattern="^[\da-fA-F]&#123;1,8&#125;$" style="{focused?('border-color:'+focusedColor+';background-color:'+focusedHalfColor):''}" type="text" value="{voltage}"/>
        <svg>
            <circle cx="0.5em" cy="0.5em" fill={focused?focusedColor:value2Color(value)} r="0.5em"/>
        </svg>
    </div>
    <Tooltip persistent>
        {x}
        ,{y}
    </Tooltip>
</Wrapper>