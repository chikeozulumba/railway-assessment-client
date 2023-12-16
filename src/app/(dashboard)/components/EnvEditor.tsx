import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Spacer, VStack } from '@chakra-ui/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { TrashIcon } from '@heroicons/react/24/outline';

type Props = {
  setEnvVariables?: (data: any) => void;
}

export const EnvEditor = (props: Props) => {
  const [entries, setEntries] = useState<{ key: string | undefined; value: string | undefined; }[]>([{ key: undefined, value: undefined, }]);

  const { control, getValues, register, watch, 
    formState: { errors }, } = useForm({
      defaultValues: {
        root: [{ key: undefined, value: undefined }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "root",
  });

  watch(({ root }) => {
    props.setEnvVariables?.(root);
  })

  function handleKeyPressed(evt: KeyboardEvent<HTMLInputElement>, index: number, field: string) {
    const isEnterKeyPressed = evt.code === 'Enter';
    const isFirstEntry = field === 'key';
    const key = getValues(`root.${index}.key`) as string | undefined
    const value = getValues(`root.${index}.value`) as string | undefined
    const validateFields = (key?.length || 0) > 0 && (value?.length || 0) > 0

    if (!isFirstEntry && isEnterKeyPressed && validateFields) {
      append({ key: undefined, value: undefined, });
      return;
    }
  }

  return (<VStack gap={0} w={'100%'}>
    <FormLabel
      margin={0}
      mb={1}
      width={'100%'}
      textAlign={'left'}
      fontSize={"small"}
    >
      Environment Variables
    </FormLabel>
    <VStack w={'100%'}>
      {fields.map((entry, i) => {
        return <HStack w={'100%'}>
          <HStack key={'parent-' + i} gap={4}>
            <FormControl isInvalid={Boolean(errors.root?.[i].type)}>
              <Input
                fontSize={'12px'}
                size="sm" placeholder={'Key'}
                _focusVisible={{
                  borderColor: "#000",
                  borderWidth: 1.5,
                }}
                {...register(`root.${i}.key` as const, {
                  required: {
                    value: true,
                    message: 'Field is not valid.'
                  },
                  minLength: {
                    value: 1,
                    message: 'Field is not valid.'
                  },
                })}
                onKeyDown={(evt) => handleKeyPressed(evt, i, 'key')}
              />
              <FormErrorMessage mt={1} fontWeight={500} fontSize={"xs"}>
                {errors.root?.[i].message &&
                  String(errors.root?.[i].message)}
              </FormErrorMessage>
            </FormControl>


            <FormControl isInvalid={Boolean(errors.root?.[i].type)}>
              <Input
                fontSize={'12px'}
                size="sm" placeholder={'Value'}
                _focusVisible={{
                  borderColor: "#000",
                  borderWidth: 1.5,
                }}
                {...register(`root.${i}.value` as const)}
                onKeyDownCapture={(evt) => handleKeyPressed(evt, i, 'value')}
              />
            </FormControl>
          </HStack>
          <Spacer />
          <Button visibility={(i === 0 && entries.length <= 1) ? 'hidden' : undefined} onClick={() => remove(i)} opacity={'0.5'} _hover={{ bg: 'transparent', color: 'red', opacity: '1' }} width={'fit-content'} height={'fit-content'} variant={'ghost'} padding={0}>
            <TrashIcon height={18} width={18} />
          </Button>
        </HStack>
      })}
    </VStack>
  </VStack>
  );
}