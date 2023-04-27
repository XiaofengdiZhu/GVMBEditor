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
        createEventDispatcher,
        onDestroy
    } from "svelte";
    import IconButton
        from "@smui/icon-button";
    import {
        imageData2values,
        string2values
    } from "../Converter";

    export let open: boolean = false;
    export let inputString: string = "";
    const dispatch = createEventDispatcher();

    function closeHandler(e: CustomEvent<{
        action: string
    }>) {
        if (e.detail.action === 'ok') {
            if (imgLoaded) {
                dispatch('import', {
                    width: imgWidth,
                    height: imgHeight,
                    values: imageData2values(canvas.getContext('2d').getImageData(0, 0, imgWidth, imgHeight))
                });
            } else if (inputString.length > 0) {
                dispatch('import', string2values(inputString));
            }
        }
        reset(true);
    }

    let valueTypeFiles: FileList | null = null;
    let imgWidth: number = 0;
    let imgHeight: number = 0;
    let imgLoading = false;
    let imgLoaded = false;
    let canvas: HTMLCanvasElement;

    function fileChange() {
        if (valueTypeFiles && valueTypeFiles[0].type.startsWith("image/")) {
            imgLoading = true;
            createImageBitmap(valueTypeFiles[0], {colorSpaceConversion: "none"}).then((image) => {
                imgWidth = image.width;
                imgHeight = image.height;
                //不知道为什么，总之得延迟一下才能画
                setTimeout(() => {
                    canvas.getContext('2d').drawImage(image, 0, 0, imgWidth, imgHeight);
                    imgLoaded = true;
                    imgLoading = false;
                }, 0);
            });
        } else {
            valueTypeFiles = null;
            dispatch('error', {
                title: "错误",
                message: "加载的文件可能不是图片"
            })
        }
    }

    function removeImg(e: Event) {
        e.preventDefault();
        reset(false);
    }

    function reset(clearInputString: boolean) {
        if (clearInputString) inputString = '';
        valueTypeFiles = null;
        imgWidth = 0;
        imgHeight = 0;
        imgLoaded = false;
        imgLoading = false;
    }

    onDestroy(() => {
        valueTypeFiles = null;
    });
</script>
<Dialog bind:open on:SMUIDialog:closed={closeHandler}>
    <Title>
        导入</Title>
    <Content>
        <Textfield label={"请输入要导入的字符串"+((imgLoading||imgLoaded)?"（您已选择图片）":"")} style="width: 512px;max-width:90%;" bind:value={inputString} disabled={imgLoading||imgLoaded}/>
        <Textfield bind:files={valueTypeFiles} label={(imgLoaded?"":"或") + "请选择图片"} type="file" accept="image/*" class="hide-file-ui" style="margin-top: 1em;width: 512px;max-width:90%;" on:change={fileChange}>
            <svelte:fragment slot="trailingIcon">
                {#if imgLoaded}
                    <IconButton class="material-icons" size="mini" on:click={removeImg}>
                        delete
                    </IconButton>
                {/if}
            </svelte:fragment>
        </Textfield>
        <div style="text-align: center;">
            <canvas bind:this={canvas} style="max-width: 70%;max-height: 600px;object-fit:scale-down;margin-top:1em;" title="将从此导入数据" width={imgWidth} height={imgHeight}/>
            {#if imgLoaded}
                <div>{"(" + imgWidth + "*" + imgHeight + ")"}</div>
            {/if}
        </div>
    </Content>
    <Actions>
        <Button>
            <Label>取消</Label>
        </Button>
        <Button action="ok">
            <Label>确定</Label>
        </Button>
    </Actions>
</Dialog>