// src/composables/usePageParams.ts
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { Ref } from 'vue'

type ParamConverter<T> = {
    [K in keyof T]?: (value: any) => T[K]
}

interface UsePageParamsOptions<T> {
    defaultParams?: T
    converters?: ParamConverter<T>
    onParamsLoaded?: (params: T) => void
}

/**
 * 高级页面参数Hook
 * @param options 配置选项
 * @returns 包含页面参数和相关方法的对象
 */
export function usePageParams<T extends Record<string, any>>(
    options: UsePageParamsOptions<T> = {}
): {
    params: Ref<T>
    rawParams: Ref<Record<string, any>>
    resetParams: (newDefaults?: Partial<T>) => void
} {
    const defaultParams = (options.defaultParams || {}) as T
    const params = ref<T>({ ...defaultParams }) as Ref<T>
    const rawParams = ref<Record<string, any>>({})

    const processParams = (source: Record<string, any>): T => {
        const result = { ...defaultParams }

        for (const key in source) {
            if (options.converters && options.converters[key as keyof T]) {
                result[key as keyof T] = options.converters[key as keyof T]!(source[key])
            } else {
                result[key as keyof T] = source[key]
            }
        }

        return result
    }

    onLoad((opts) => {
        rawParams.value = opts || {}
        params.value = processParams(opts || {})
        options.onParamsLoaded?.(params.value)
    })

    const resetParams = (newDefaults?: Partial<T>) => {
        if (newDefaults) {
            Object.assign(defaultParams, newDefaults)
        }
        params.value = { ...defaultParams, ...processParams(rawParams.value) }
    }

    return {
        params,
        rawParams,
        resetParams
    }
}