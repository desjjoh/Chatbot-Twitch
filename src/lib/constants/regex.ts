const regExpCommand: RegExp = new RegExp(/^!([a-zA-Z0-9]+)(?:\S+)?(.*)?/)
const regExpIDExtract: RegExp = new RegExp(/^([0-9]*) *(.+)?/)

export { regExpCommand, regExpIDExtract }
