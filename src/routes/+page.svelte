<script lang="ts">
    import TopAppBar, {
        Row,
        Section,
        Title
    } from '@smui/top-app-bar';
    import Fab
        from '@smui/fab';
    import IconButton
        from '@smui/icon-button';
    import {
        Icon
    } from '@smui/common';
    import Button, {
        Label
    } from '@smui/button';
    import Dialog, {
        Actions,
        Content,
        Title as DialogTitle
    } from '@smui/dialog';
    import Tooltip, {
        Wrapper
    } from '@smui/tooltip';
    import {
        Grid
    } from "svelte-virtual";
    import PositiveIntegerInput
        from "./components/PositiveIntegerInput.svelte";
    import Cell
        from "./components/Cell.svelte";
    import ImportDialog
        from "./dialog/ImportDialog.svelte";
    import {
        storeValues
    } from "./store.ts";
    import {
        onDestroy
    } from "svelte";
    import ExportDialog
        from "./dialog/ExportDialog.svelte";

    let items = [...Array(100000).keys()];
    let errorDialogOpen: boolean = false;
    let errorTitle: string = "";
    let errorMessage: string = "";

    function errorHandler(title: string, message: string) {
        errorDialogOpen = true;
        errorTitle = title;
        errorMessage = message;
    }

    let importDialogOpen: boolean = false;
    let exportDialogOpen: boolean = false;

    function zoomInHandler() {
        scale += 0.25;
    }

    function zoomOutHandler() {
        scale -= 0.25;
    }

    let values: number[][];
    export let valuesWidth: number = 0;
    export let valuesHeight: number = 0;
    let width: number = 0;

    function setWidth(value: number) {
        width = value;
    }

    let height: number = 0;

    function setHeight(value: number) {
        height = value;
    }

    let scale: number = 1;
    const unsubscribe = storeValues.subscribe((newValues: number[][]) => {
        values = newValues;
    });
    onDestroy(unsubscribe);

    initiate(16, 16);

    function initiate(inWidth: number, inHeight: number, inValues: number[][] | null = null) {
        storeValues.initiate(inWidth, inHeight, inValues);
        valuesWidth = inWidth;
        valuesHeight = inHeight;
        width = inWidth;
        height = inHeight;
    }

    function onCellChange({detail}: Event) {
        storeValues.write(detail.x, detail.y, detail.value);
    }

    function onError({detail}: Event) {
        errorHandler(detail.title, detail.message);
    }

    function initiateButtonHandler() {
        if (width > 0 && height > 0) {
            initiate(width, height);
        }
    }

    function exportButtonHandler() {
        exportDialogOpen = true;
    }

    function importButtonHandler() {
        importDialogOpen = true;
    }

    function importHandler({detail}: Event) {
        initiate(detail.width, detail.height, detail.values);
    }

    let mainGridHeight;
</script>
<style>
    .mainContent {
        display: grid;
        grid-template-rows: 128px auto;
        padding: 1em;
        height: calc(100% - 64px - 2em);
    }

    .mainGrid {
        height: 100%;
    }
</style>
<TopAppBar color='primary' style="box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);" variant="static">
    <Row>
        <Section>
            <Title style="padding-left: 0.5em;">
                <Icon class="material-icons" style="vertical-align: sub;">
                    grid_view
                </Icon>
                十亿伏特存储器在线编辑
            </Title>
        </Section>
        <Section align="end" style="margin-right: 0.2em;" toolbar>
            <Wrapper>
                <IconButton class="material-icons" on:click={importButtonHandler} style="transform:rotate(90deg);margin-right: 0.1em;">
                    exit_to_app
                </IconButton>
                <Tooltip>
                    导入
                </Tooltip>
            </Wrapper>
            <Wrapper>
                <IconButton class="material-icons" on:click={exportButtonHandler}>
                    ios_share
                </IconButton>
                <Tooltip>
                    导出
                </Tooltip>
            </Wrapper>
        </Section>
    </Row>
</TopAppBar>
<div class="mainContent">
    <div style="display: flex;flex-wrap:wrap;align-items:center;gap:1em;">
        <PositiveIntegerInput afterChangeHandler={setWidth} label="设置宽" resetValue={valuesWidth} value={width}/>
        <PositiveIntegerInput afterChangeHandler={setHeight} label="设置高" resetValue={valuesHeight} value={height}/>
        <Wrapper>
            <Button on:click={initiateButtonHandler} variant="raised">
                <Label>初始化</Label>
            </Button>
            <Tooltip>
                将清空当前数据！！！
            </Tooltip>
        </Wrapper>
    </div>
    <div class="mainGrid">
        <div bind:clientHeight={mainGridHeight} style="height:100%;font-size:{16*scale}px">
            <Grid columnCount={valuesWidth} height={mainGridHeight} itemCount={valuesWidth * valuesHeight} itemHeight={1.4*16*scale+3} itemWidth={6.4*16*scale+3} width="100%">
                <div let:columnIndex let:rowIndex let:style slot="item" {style}>
                    <Cell on:change={onCellChange} on:error={onError} value={values[rowIndex][columnIndex] ?? 0} x={columnIndex} y={rowIndex}/>
                </div>
            </Grid>
        </div>
    </div>
</div>
<Wrapper>
    <Fab color="secondary" exited={scale<=0.75} on:click={zoomOutHandler} style="position: fixed;left:1.5em;bottom:calc(3em + 56px);">
        <Icon class="material-icons">
            zoom_out
        </Icon>
    </Fab>
    <Tooltip>
        缩小
    </Tooltip>
</Wrapper>
<Wrapper>
    <Fab color="primary" on:click={zoomInHandler} style="position: fixed;left:1.5em;bottom:1.5em;">
        <Icon class="material-icons">
            zoom_in
        </Icon>
    </Fab>
    <Tooltip>
        放大
    </Tooltip>
</Wrapper>
<ImportDialog bind:open={importDialogOpen} on:import={importHandler} on:error={onError}/>
<ExportDialog bind:open={exportDialogOpen} on:error={onError} values={values} valuesWidth={valuesWidth} valuesHeight={valuesHeight}/>
<Dialog bind:open={errorDialogOpen}>
    <DialogTitle>{errorTitle}</DialogTitle>
    <Content>{errorMessage}</Content>
    <Actions>
        <Button>
            <Label>OK</Label>
        </Button>
    </Actions>
</Dialog>