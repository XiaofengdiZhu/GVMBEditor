<script lang="ts">
    import Dialog, {
        Actions,
        Content,
        Title
    } from '@smui/dialog';
    import Button, {
        Label
    } from '@smui/button';
    import Textfield
        from '@smui/textfield';
    import {
        values2imageData,
        values2string
    } from "../Converter";

    export let open: boolean = false;
    export let values: number[][];
    export let valuesWidth: number = 0;
    export let valuesHeight: number = 0;
    let inputString: string = "";

    function closeHandler() {
        reset();
    }

    let imgWidth: number = 0;
    let imgHeight: number = 0;
    let imgLoading = false;
    let imgLoaded = false;
    let canvas: HTMLCanvasElement;
    $:if (open) {
        imgWidth = valuesWidth;
        imgHeight = valuesHeight;
        inputString = values2string(values);
        setTimeout(() => {
            canvas.getContext("2d").putImageData(values2imageData(values, valuesWidth, valuesHeight), 0, 0);
            imgLoaded = true;
        }, 0);
    }

    function reset() {
        inputString = '';
        imgWidth = 0;
        imgHeight = 0;
        imgLoaded = false;
        imgLoading = false;
    }
</script>
<Dialog bind:open on:SMUIDialog:closed={closeHandler}>
    <Title>
        导出</Title>
    <Content>
        <Textfield label="字符串-全选复制" textarea style="width: 512px;max-width:90%;margin-top: 1em;" bind:value={inputString}/>
        <div style="text-align: center;">
            <canvas bind:this={canvas} style="max-width: 70%;max-height: 600px;object-fit:scale-down;margin-top:1em;border:1px black solid" width={imgWidth} height={imgHeight}/>
            {#if imgLoaded}
                <div>
                    图片-长按/右键保存
                </div>
            {/if}
        </div>
    </Content>
    <Actions>
        <Button>
            <Label>关闭</Label>
        </Button>
    </Actions>
</Dialog>