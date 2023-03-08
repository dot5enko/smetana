import { Box, Flex, Text } from "@chakra-ui/react";
import { DragEventHandler, useState } from "react";
import { importType, ParsedTypeFromIdl } from "../../background/types/DataType";
import { parseIdlTypes } from '../../background/idl'
import { ItemSelector } from "../components/menu/ItemSelect";
import { MenuDivider } from "../components/menu/MenuDivider";
import { MenuEntryWithSublabel } from "../components/menu/MenuEntryWithSublabel";
import { useExtensionContext } from "../components/context/ExtensionContext";

export function ImportIdl() {

    const { setRoute } = useExtensionContext();

    const [drag, setDrag] = useState(false);

    const handleDrag = function (e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDrag(true);
        } else if (e.type === "dragleave") {
            setDrag(false);
        }
    };

    const [types, setTypes] = useState<ParsedTypeFromIdl[] | undefined>(undefined);
    const [typeChanges, setTypesChanges] = useState(0);
    const [typesSelected, setSelected] = useState<ParsedTypeFromIdl[]>([]);

    const handleDrop: DragEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer?.files && e.dataTransfer?.files[0]) {
            // at least one file has been dropped so do something
            // handleFiles(e.dataTransfer.files);
            console.log('file dropped', e.dataTransfer.files)

            e.dataTransfer.files[0].text().then((text) => {
                let idlJson = JSON.parse(text)

                parseIdlTypes(idlJson, true).then((simpleTypes) => {

                    let result: ParsedTypeFromIdl[] = [];

                    for (var parsedFromIdl of simpleTypes) {

                        result.push(parsedFromIdl[1])
                    }

                    setTypes(result);
                    setTypesChanges(typeChanges + 1)

                    console.log('parsed idl:', simpleTypes);
                });

            });
        }
    }

    const importSelected = async () => {

        for (var it of typesSelected) {
            await importType(it)
        }

        setRoute('data_types', "Data types");
    }

    return <>
        {!types ?
            <form onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <input type="file" hidden={true} multiple={true}></input>
                <Flex direction="column"

                    cursor="pointer" justifyContent={"center"} textAlign="center" height="200px" width="100%" border={drag ? "5px dashed #c7c7c7" : "3px dashed #c7c7c7"} borderRadius="10px">
                    Drop idl *.json here

                </Flex>
            </form> : null}

        <Box>
            {types ? <>
                <ItemSelector isMultiselect={true} elementRenderer={(it) => {

                    if (it.struct) {
                        return <Box>
                            <Flex gap="5px">
                                {it.complex ? <Text fontSize="xs" color="red.300">incomplete</Text> : null}
                                {it.struct ? <Text fontSize="xs" color="gray.300">struct</Text> : null}
                                <Text fontWeight={"bold"} fontSize="sm" color="white">{it.name}</Text>
                            </Flex>
                        </Box>
                    } else {
                        return <Box>
                            <Flex gap="5px">
                                {it.complex ? <Text fontSize="xs" color="red.300">incomplete</Text> : null}
                                {it.struct ? <Text fontSize="xs" color="gray.300">struct</Text> : null}
                            </Flex>
                            <Text fontWeight={"bold"} color="white">{it.name}</Text>
                            <Text fontSize={"sm"}>{it.info.size_bytes} bytes in {it.fields.length} fields</Text>
                        </Box>
                    }
                }} value={typesSelected} options={types}
                    onSelectorValueChange={(newval) => {
                        setSelected(newval);
                    }}
                ></ItemSelector>
                <MenuDivider width={0} />
                <MenuEntryWithSublabel action={importSelected} text={typesSelected.length == 0 ? "please, select types to import first" : undefined}>
                    Import
                </MenuEntryWithSublabel>
            </> : null}

        </Box>

    </>
}