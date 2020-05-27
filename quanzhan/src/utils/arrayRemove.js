    //    传进需要操作的数组和字符串
export function arrayRemove(array, string) {
    //   判断该字符串是否在数组中
    const index = array.indexOf(string);
    //    如果在的话，就删除该数组的这个字符串
    if (index >= 0) {
        array.splice(index, 1)
    }
}